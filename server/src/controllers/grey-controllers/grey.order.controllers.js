const GreyOrderModel = require("../../models/grey-manager/greyOrder.model");
const HttpError = require("../../models/http-error");
const { validationResult } = require("express-validator");
const getNextSequence = require("../../utils/getNextSequence");

// Get All Grey Orders
const getAllGreyOrders = async (req, res, next) => {
  try {
    const greyOrders = await GreyOrderModel.find();
    res.json({
      greyOrders: greyOrders.map((o) => o.toObject({ getters: true })),
    });
  } catch (err) {
    next(
      new HttpError("Failed to fetch grey orders. Please try again later.", 500)
    );
  }
};

// Get Grey Order by Id
const getGreyOrderById = async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    const greyOrder = await GreyOrderModel.findById(orderId);
    if (!greyOrder) {
      throw new HttpError("Grey Order not found", 404);
    }

    res.json({ greyOrder: greyOrder.toObject({ getters: true }) });
  } catch (err) {
    return next(
      err instanceof HttpError
        ? err
        : new HttpError("Fetching grey order failed, please try again.", 500)
    );
  }
};

// Create New Grey Order
// ✅ Create New Grey Order
const createGreyOrder = async (req, res, next) => {
  try {
    // 1. Generate next order number safely
    const orderNo = await getNextSequence("greyOrder");

    // 2. Build new order
    const newOrder = new GreyOrderModel({
      orderNo,
      orderDate: req.body.orderDate || new Date(),
      agentName: req.body.agentName,
      itemName: req.body.itemName,
      rate: req.body.rate,
      than: req.body.than,
      partyName: req.body.partyName,
      remarks: req.body.remarks || "",
    });

    // 3. Save and respond
    await newOrder.save();
    res.status(201).json({ order: newOrder });
  } catch (err) {
    console.error(err);
    next(new HttpError("Failed to create order", 500));
  }
};
// Update Grey Order
const updateGreyOrder = async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    // 1. Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Errors:", errors.array());
      throw new HttpError("Invalid input passed, please check your data", 422);
    }

    const { orderNo, agentName, itemName, rate, than, partyName, remarks } =
      req.body;
    // const trimmedOrderNo = orderNo.trim();

    // 2. Check for existing order
    const existingOrder = await GreyOrderModel.findById(orderId);
    if (!existingOrder) {
      throw new HttpError("Grey Order not found", 404);
    }

    // 3. Update order
    existingOrder.agentName = agentName;
    existingOrder.itemName = itemName;
    existingOrder.rate = rate;
    existingOrder.than = than;
    existingOrder.partyName = partyName;
    existingOrder.remarks = remarks;

    await existingOrder.save();

    res
      .status(200)
      .json({ greyOrder: existingOrder.toObject({ getters: true }) });
  } catch (err) {
    console.error("Error updating grey order:", err);
    next(
      err instanceof HttpError
        ? err
        : new HttpError("Updating grey order failed, please try again.", 500)
    );
  }
};

// Delete Grey Order
const deleteGreyOrder = async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    const existingOrder = await GreyOrderModel.findById(orderId);
    if (!existingOrder) {
      throw new HttpError("Grey Order not found", 404);
    }

    await existingOrder.deleteOne();

    res.status(200).json({ message: "Grey Order deleted successfully." });
  } catch (err) {
    console.error("Error deleting grey order:", err);
    next(
      err instanceof HttpError
        ? err
        : new HttpError("Deleting grey order failed, please try again.", 500)
    );
  }
};

module.exports = {
  getAllGreyOrders,
  getGreyOrderById,
  createGreyOrder,
  updateGreyOrder,
  deleteGreyOrder,
};
