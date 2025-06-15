// 📦 Import Dependencies
const NeftRequest = require("../../models/neft/neftRequest.model");
const HttpError = require("../../utils/httpError");

// 🔹 Create New NEFT Request
const createNeftRequest = async (req, res, next) => {
  try {
    const { neftNo, neftAmount, neftDate, remark, parties } = req.body;

    // ✅ Basic validation (you can add Joi/Zod later for advanced validation)
    if (!neftNo || !neftAmount || !parties || !Array.isArray(parties)) {
      return next(new HttpError("Missing required NEFT fields", 422));
    }

    // ✅ Create and save new NEFT request
    const newNeft = new NeftRequest({
      neftNo,
      neftAmount,
      neftDate,
      remark,
      parties,
      //   createdBy: req.userId, // You can set this from auth middleware
    });

    await newNeft.save();
    res
      .status(201)
      .json({ message: "NEFT request created successfully", neft: newNeft });
  } catch (err) {
    console.error("[❌ NEFT CREATE ERROR]", err);
    return next(new HttpError("Failed to create NEFT request", 500));
  }
};

// 🔹 Get All NEFT Requests
const getAllNeftRequests = async (req, res, next) => {
  try {
    const nefts = await NeftRequest.find().sort({ neftNo: -1 }); // latest first
    res.status(200).json({ nefts });
  } catch (err) {
    return next(new HttpError("Fetching NEFT requests failed", 500));
  }
};

// 🔹 Get Single NEFT by ID
const getSingleNeftRequest = async (req, res, next) => {
  try {
    const neft = await NeftRequest.findById(req.params.id);
    if (!neft) return next(new HttpError("NEFT not found", 404));
    res.status(200).json({ neft });
  } catch (err) {
    return next(new HttpError("Fetching NEFT failed", 500));
  }
};

// 🔹 Update NEFT Status (Paid / Pending / Partial etc.)
const updateNeftStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const neft = await NeftRequest.findById(req.params.id);
    if (!neft) return next(new HttpError("NEFT not found", 404));

    neft.neftStatus = status;
    await neft.save();

    res.status(200).json({ message: "NEFT status updated", neft });
  } catch (err) {
    return next(new HttpError("Failed to update NEFT status", 500));
  }
};

// 🔹 Delete NEFT Request (optional — only if not paid)
// const deleteNeftRequest = async (req, res, next) => {
//   try {
//     const neft = await NeftRequest.findById(req.params.id);
//     if (!neft) return next(new HttpError("NEFT not found", 404));

//     if (neft.neftStatus === "Paid") {
//       return next(new HttpError("Cannot delete a paid NEFT", 403));
//     }

//     await neft.deleteOne();
//     res.status(200).json({ message: "NEFT deleted" });
//   } catch (err) {
//     return next(new HttpError("Failed to delete NEFT", 500));
//   }
// };

// 🔸 Export All Functions
module.exports = {
  createNeftRequest,
  getAllNeftRequests,
  getSingleNeftRequest,
  updateNeftStatus,
  //   deleteNeftRequest,
};
