// 📦 Import Dependencies
const { validationResult } = require("express-validator");

// 🔗 Import Models
const Agents = require("../../models/master/agent.model");

// ⚙️ Import Services
const HttpError = require("../../utils/httpError");

// Get All Agents
const getAllAgents = async (req, res, next) => {
  try {
    const agents = await Agents.find();
    res.json({ agents: agents.map((a) => a.toObject({ getters: true })) });
  } catch (err) {
    next(new HttpError("Failed to fetch agents. Please try again later.", 500));
  }
};

// Get Agent by Id
const getAgentById = async (req, res, next) => {
  const agentId = req.params.agtId;

  try {
    const agent = await Agents.findById(agentId);
    if (!agent) {
      throw new HttpError("Agent not found", 404);
    }

    res.json({ agent: agent.toObject({ getters: true }) });
  } catch (err) {
    return next(
      err instanceof HttpError
        ? err
        : new HttpError("Fetching agent failed, please try again.", 500)
    );
  }
};

// Create New Agent
const createAgent = async (req, res, next) => {
  try {
    // 1. Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Errors:", errors.array());
      throw new HttpError("Invalid input passed, please check your data", 422);
    }

    const { agentName, type, bank } = req.body;
    const trimmedName = agentName.trim();

    // 2. Check for existing item
    const exists = await Agents.findOne({ agentName: trimmedName });
    if (exists) {
      throw new HttpError("Agent with this name already exists.", 422);
    }

    // 3. Create and save item
    const newAgent = await new Agents({
      agentName: trimmedName,
      type,
      bank,
    }).save();

    // 4. Respond with created item
    res.status(201).json({ agents: newAgent.toObject({ getters: true }) });
  } catch (err) {
    // 5. Handle duplicate insert race condition
    if (err.code === 11000) {
      return next(new HttpError("Duplicate Agent name", 422));
    }
    console.error("Create Agent Error:", err);

    return next(
      err instanceof HttpError
        ? err
        : new HttpError("Internal server error", 500)
    );
  }
};

// Update Agent
const updatedAgent = async (req, res, next) => {
  try {
    // 1. Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Errors:", errors.array());
      throw new HttpError("Invalid input passed, please check your data", 422);
    }

    const { agentName, type, bank } = req.body;
    const agentId = req.params.agtId;

    // 2. Fetch the item
    const agent = await Agents.findById(agentId);
    if (!agent) {
      throw new HttpError("Agent not found", 404);
    }

    // 3. Check for duplicate agentName (excluding itself)
    if (agentName && agentName !== agent.agentName) {
      const exists = await Agents.findOne({ agentName });
      if (exists && exists._id.toString() !== agentId) {
        throw new HttpError("Agent with this name already exists", 422);
      }
      agent.agentName = agentName.trim();
    }

    // 4. Update other fields
    if (type) agent.type = type;
    if (bank) {
      if (bank.bankName) agent.bank.bankName = bank.bankName;
      if (bank.accNo) agent.bank.accNo = bank.accNo;
      if (bank.ifsc) agent.bank.ifsc = bank.ifsc;
    }

    // 5. Save and respond
    await agent.save();
    res.status(200).json({ agent: agent.toObject({ getters: true }) });
  } catch (err) {
    if (err.code === 11000) {
      return next(new HttpError("Duplicate Agent name", 422));
    }
    return next(
      err instanceof HttpError
        ? err
        : new HttpError("Failed to update item", 500)
    );
  }
};

// Delete Agent By Id
const deleteAgentById = async (req, res, next) => {
  const agentId = req.params.agtId;

  try {
    const agent = await Agents.findById(agentId);
    if (!agent) {
      throw new HttpError("Agent not found", 404);
    }

    await agent.deleteOne();

    res.status(200).json({ message: "Agent deleted successfully" });
  } catch (err) {
    return next(
      err instanceof HttpError
        ? err
        : new HttpError("Failed to delete agent", 500)
    );
  }
};

exports.getAllAgents = getAllAgents;
exports.getAgentById = getAgentById;
exports.createAgent = createAgent;
exports.updatedAgent = updatedAgent;
exports.deleteAgentById = deleteAgentById;
