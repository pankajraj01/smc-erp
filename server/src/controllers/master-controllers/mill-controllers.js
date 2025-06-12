const Mill = require("../../models/master-models/mill");
const HttpError = require("../../models/http-error");
const { validationResult } = require("express-validator");

// Get All Mills
const getAllMills = async (req, res, next) => {
  try {
    const mills = await Mill.find();
    res.json({ mills: mills.map((m) => m.toObject({ getters: true })) });
  } catch (err) {
    next(new HttpError("Failed to fetch mills. Please try again later.", 500));
  }
};

// Get Mill by Id
const getMillById = async (req, res, next) => {
  const millId = req.params.millId;

  try {
    const mill = await Mill.findById(millId);
    if (!mill) {
      throw new HttpError("Mill not found", 404);
    }

    res.json({ mill: mill.toObject({ getters: true }) });
  } catch (err) {
    return next(
      err instanceof HttpError
        ? err
        : new HttpError("Fetching Mill failed, please try again.", 500)
    );
  }
};

// Create New Mill
const createMill = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Errors:", errors.array());
      throw new HttpError("Invalid input passed, please check your data", 422);
    }

    const { millName, bank } = req.body;
    const trimmedName = millName.trim();

    const exists = await Mill.findOne({ millName: trimmedName });
    if (exists) {
      throw new HttpError("Mill with this name already exists.", 422);
    }

    const newMill = await new Mill({
      millName: trimmedName,
      bank,
    }).save();

    res.status(201).json({ mill: newMill.toObject({ getters: true }) });
  } catch (err) {
    if (err.code === 11000) {
      return next(new HttpError("Duplicate Mill Name", 422));
    }
    console.error("Create Mill Error:", err);

    return next(
      err instanceof HttpError
        ? err
        : new HttpError("Internal server error", 500)
    );
  }
};

// Update Mill
const updatedMill = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Errors:", errors.array());
      throw new HttpError("Invalid input passed, please check your data", 422);
    }

    const { millName, bank } = req.body;
    const millId = req.params.millId;

    const mill = await Mill.findById(millId);
    if (!mill) {
      throw new HttpError("Mill not found", 404);
    }

    if (millName && millName !== mill.millName) {
      const exists = await Mill.findOne({ millName });
      if (exists && exists._id.toString() !== millId) {
        throw new HttpError("Mill with this name already exists", 422);
      }
      mill.millName = millName.trim();
    }

    if (bank) {
      if (bank.bankName) mill.bank.bankName = bank.bankName;
      if (bank.accountNo) mill.bank.accountNo = bank.accountNo;
      if (bank.ifsc) mill.bank.ifsc = bank.ifsc;
    }

    await mill.save();
    res.status(200).json({ mill: mill.toObject({ getters: true }) });
  } catch (err) {
    if (err.code === 11000) {
      return next(new HttpError("Duplicate Mill name", 422));
    }
    return next(
      err instanceof HttpError
        ? err
        : new HttpError("Failed to update Mill", 500)
    );
  }
};

// Delete Mill By Id
const deleteMill = async (req, res, next) => {
  const millId = req.params.millId;

  try {
    const mill = await Mill.findById(millId);
    if (!mill) {
      throw new HttpError("Mill not found", 404);
    }

    await mill.deleteOne();

    res.status(200).json({ message: "Mill deleted successfully" });
  } catch (err) {
    return next(
      err instanceof HttpError
        ? err
        : new HttpError("Failed to delete Mill", 500)
    );
  }
};

exports.getAllMills = getAllMills;
exports.getMillById = getMillById;
exports.createMill = createMill;
exports.updatedMill = updatedMill;
exports.deleteMill = deleteMill;
