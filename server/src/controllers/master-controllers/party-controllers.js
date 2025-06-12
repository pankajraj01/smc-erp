const Party = require("../../models/master-models/party");
const HttpError = require("../../models/http-error");
const { validationResult } = require("express-validator");

// Get All Parties
const getAllParties = async (req, res, next) => {
  try {
    const parties = await Party.find();
    res.json({ parties: parties.map((p) => p.toObject({ getters: true })) });
  } catch (err) {
    next(
      new HttpError("Failed to fetch parties. Please try again later.", 500)
    );
  }
};

// Get Party by Id
const getPartyById = async (req, res, next) => {
  const partyId = req.params.ptyId;

  try {
    const party = await Party.findById(partyId);
    if (!party) {
      throw new HttpError("Party not found", 404);
    }

    res.json({ party: party.toObject({ getters: true }) });
  } catch (err) {
    return next(
      err instanceof HttpError
        ? err
        : new HttpError("Fetching Party failed, please try again.", 500)
    );
  }
};

// Create New Party
const createParty = async (req, res, next) => {
  try {
    // 1. Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Errors:", errors.array());
      throw new HttpError("Invalid input passed, please check your data", 422);
    }

    const { partyName, type, bank } = req.body;
    const trimmedName = partyName.trim();

    // 2. Check for existing item
    const exists = await Party.findOne({ partyName: trimmedName });
    if (exists) {
      throw new HttpError("Party with this name already exists.", 422);
    }

    // 3. Create and save item
    const newParty = await new Party({
      partyName: trimmedName,
      type,
      bank,
    }).save();

    // 4. Respond with created item
    res.status(201).json({ party: newParty.toObject({ getters: true }) });
  } catch (err) {
    // 5. Handle duplicate insert race condition
    if (err.code === 11000) {
      return next(new HttpError("Duplicate Part Name", 422));
    }
    console.error("Create Party Error:", err);

    return next(
      err instanceof HttpError
        ? err
        : new HttpError("Internal server error", 500)
    );
  }
};

// Update Party
const updatedParty = async (req, res, next) => {
  try {
    // 1. Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Errors:", errors.array());
      throw new HttpError("Invalid input passed, please check your data", 422);
    }

    const { partyName, type, bank } = req.body;
    const partyId = req.params.ptyId;

    // 2. Fetch the item
    const party = await Party.findById(partyId);
    if (!party) {
      throw new HttpError("Party not found", 404);
    }

    // 3. Check for duplicate agentName (excluding itself)
    if (partyName && partyName !== party.partyName) {
      const exists = await Party.findOne({ partyName });
      if (exists && exists._id.toString() !== partyId) {
        throw new HttpError("Party with this name already exists", 422);
      }
      party.partyName = partyName.trim();
    }

    // 4. Update other fields
    if (type) party.type = type;
    if (bank) {
      if (bank.bankName) party.bank.bankName = bank.bankName;
      if (bank.accountNo) party.bank.accountNo = bank.accountNo;
      if (bank.ifsc) party.bank.ifsc = bank.ifsc;
    }

    // 5. Save and respond
    await party.save();
    res.status(200).json({ party: party.toObject({ getters: true }) });
  } catch (err) {
    if (err.code === 11000) {
      return next(new HttpError("Duplicate Party name", 422));
    }
    return next(
      err instanceof HttpError
        ? err
        : new HttpError("Failed to update Party", 500)
    );
  }
};

// Delete Party By Id
const deleteParty = async (req, res, next) => {
  const partyId = req.params.ptyId;

  try {
    const party = await Party.findById(partyId);
    if (!party) {
      throw new HttpError("Party not found", 404);
    }

    await party.deleteOne();

    res.status(200).json({ message: "Party deleted successfully" });
  } catch (err) {
    return next(
      err instanceof HttpError
        ? err
        : new HttpError("Failed to delete Party", 500)
    );
  }
};

exports.getAllParties = getAllParties;
exports.getPartyById = getPartyById;
exports.createParty = createParty;
exports.updatedParty = updatedParty;
exports.deleteParty = deleteParty;
