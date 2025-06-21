// 📦 Import Dependencies
const NeftRequest = require("../../models/neft/neftRequest.model");
const HttpError = require("../../utils/httpError");

// 🔹 Create New NEFT Request
const createNeftRequest = async (req, res, next) => {
  try {
    const { neftAmount, neftDate, remark, parties } = req.body;

    // ✅ Basic validation
    if (!neftAmount || !parties || !Array.isArray(parties)) {
      return next(new HttpError("Missing required NEFT fields", 422));
    }

    // ✅ Get the last NEFT no and increment
    const lastNeft = await NeftRequest.findOne().sort({ neftNo: -1 });
    const nextNeftNo = lastNeft ? lastNeft.neftNo + 1 : 1;

    // ✅ Create and save new NEFT request
    const newNeft = new NeftRequest({
      neftNo: nextNeftNo,
      neftAmount,
      neftDate: new Date(neftDate), // ensure it's a Date object
      remark,
      parties,
      // createdBy: req.userId // optional auth
    });

    await newNeft.save();
    res.status(201).json({
      message: "NEFT request created successfully",
      neft: newNeft,
    });
  } catch (err) {
    console.error("[❌ NEFT CREATE ERROR]", err);

    if (err.code === 11000) {
      return next(new HttpError("Duplicate NEFT No. Try again.", 409));
    }

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

// 🔹 Add Party to NEFT Request
const addPartyToNeft = async (req, res) => {
  const { neftId } = req.params;
  const partyData = req.body;

  try {
    const neft = await NeftRequest.findById(neftId);
    if (!neft) return res.status(404).json({ message: "NEFT not found" });

    neft.parties.push(partyData);

    // Optional: update total amount if stored in neft
    const total = neft.parties.reduce(
      (sum, p) => sum + (p.totalPartyNeftAmount || 0),
      0
    );
    neft.neftAmount = total;

    await neft.save();
    res.status(200).json({ message: "Party added successfully", neft });
  } catch (err) {
    console.error("Error adding party to NEFT:", err);
    res.status(500).json({ message: "Server error while adding party" });
  }
};

// 🔹 Update/Edit Party in NEFT Request
const updatePartyInNeft = async (req, res) => {
  const { neftId, partyId } = req.params;
  const updatedParty = req.body.parties?.[0];
  if (!updatedParty) {
    return res.status(400).json({ message: "Invalid party update payload" });
  }

  try {
    const neft = await NeftRequest.findById(neftId);
    if (!neft) return res.status(404).json({ message: "NEFT not found" });
    // console.log(neft);

    const partyIndex = neft.parties.findIndex(
      (p) => p._id?.toString() === partyId || p.partyId?.toString() === partyId
    );
    if (partyIndex === -1)
      return res.status(404).json({ message: "Party not found in NEFT" });

    const party = neft.parties[partyIndex];

    party.partyId = updatedParty.partyId;
    party.partyName = updatedParty.partyName;
    party.bank = updatedParty.bank;
    party.remark = updatedParty.remark;
    party.totalPartyNeftAmount = updatedParty.totalPartyNeftAmount;
    party.tdsTotal = updatedParty.tdsTotal;
    party.partyNeftStatus = updatedParty.partyNeftStatus || "Pending";
    party.bills = updatedParty.bills;

    // Optional: recalculate NEFT total
    neft.neftAmount = neft.parties.reduce(
      (sum, p) => sum + (p.totalPartyNeftAmount || 0),
      0
    );

    console.log("🆔 Searching for partyId:", partyId);
    console.log("Found at index:", partyIndex);
    console.log("Original Party:", neft.parties[partyIndex]);
    console.log("Incoming Update:", updatedParty);
    console.log("📦 Updated Bills:", party.bills);
    // console.log(
    //   "🧾 Before Save:",
    //   JSON.stringify(neft.parties[partyIndex], null, 2)
    // );
    // console.log("📦 Entire NEFT:", JSON.stringify(neft, null, 2));

    await neft.save();
    res.status(200).json({ message: "Party updated", neft });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Delete Party from NEFT Request
const deletePartyFromNeft = async (req, res) => {
  const { neftId, partyId } = req.params;

  try {
    const neft = await NeftRequest.findById(neftId);
    if (!neft) return res.status(404).json({ message: "NEFT not found" });

    // Filter out the party
    neft.parties = neft.parties.filter(
      (p) => p._id?.toString() !== partyId && p.partyId?.toString() !== partyId
    );

    // Recalculate total NEFT amount
    neft.neftAmount = neft.parties.reduce(
      (sum, p) => sum + (p.totalPartyNeftAmount || 0),
      0
    );

    await neft.save();
    res.status(200).json({ message: "Party deleted", neft });
  } catch (err) {
    console.error("Delete party error:", err);
    res.status(500).json({ message: "Server error while deleting party" });
  }
};

// 🔹 Update NEFT Status (Paid / Pending / Partial etc.)
const updateNeftStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const neft = await NeftRequest.findById(req.params.neftId);
    if (!neft) return res.status(404).json({ message: "NEFT not found" });

    neft.neftStatus = status;
    await neft.save();

    res.status(200).json({ message: "NEFT status updated", neft });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// 🔹 Update Party Status in NEFT Request
const updatePartyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { neftId, partyId } = req.params;
    const neft = await NeftRequest.findById(neftId);
    if (!neft) return res.status(404).json({ message: "NEFT not found" });

    const party = neft.parties.find(
      (p) => p._id?.toString() === partyId || p.partyId?.toString() === partyId
    );
    if (!party) return res.status(404).json({ message: "Party not found" });

    party.partyNeftStatus = status;
    await neft.save();

    res.status(200).json({ message: "Party status updated", neft });
  } catch (err) {
    console.error("Party status update error:", err);
    res.status(500).json({ message: "Failed to update party status" });
  }
};

// 🔸 Export All Functions
module.exports = {
  createNeftRequest,
  getAllNeftRequests,
  getSingleNeftRequest,
  addPartyToNeft,
  updatePartyInNeft,
  deletePartyFromNeft,
  updatePartyStatus,
  updateNeftStatus,
};
