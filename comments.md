/\*\*

- ***
- 📄 File : grey-order.controller.js
- 🧩 Layer : Controller
- 📦 Purpose : Handles request logic for Grey Orders
- 📚 Description : Receives data from routes, calls service logic
- 🧠 Author : Pankaj Rajpurohit / Team SMC
- 🕒 Last Updated : 2025-06-15
- ***
  \*/

// 📦 Import Dependencies
const express = require('express');

// 🔗 Import Models
const GreyOrder = require('../../models/grey/GreyOrder.model');

// ⚙️ Import Services
const greyOrderService = require('../../services/grey/grey-order.service');

// 🧠 Controller Logic...

📦 Dependencies
📁 Configs
🔗 Models
⚙️ Services
🔐 Middleware
🧰 Utilities
🧠 Controllers

All at Onces
// 📦 Import Dependencies
// 🔗 Import Models
// ⚙️ Import Services
// 🔐 Import Middleware
// 🧰 Import Utilities
// 🧠 Import Controller

example
/\*\*

- ***
- 📄 File : dummy.controller.js
- 🧩 Layer : Controller
- 📦 Purpose : Sample controller to demonstrate header patterns
- 📚 Description : Handles basic CRUD operations using full import structure
- 🧠 Author : Pankaj Rajpurohit / Team SMC
- 🕒 Last Updated : 2025-06-15
- ***
  \*/

// 📦 Import Dependencies
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

// 📂 Import Models
const DummyModel = require("../../models/master/Dummy.model");

// 🔗 Import Services
const dummyService = require("../../services/master/dummy.service");

// 🔐 Import Middleware (if any custom middlewares are used here)
// const verifyAdmin = require("../../middleware/auth/verifyAdmin");

// 🧰 Import Utilities
const HttpError = require("../../utils/httpError");
const formatDate = require("../../utils/dateFormatter");

// 🎯 Get All Dummy Records
const getAllDummies = async (req, res, next) => {
try {
const data = await DummyModel.find();
res.json({ data: data.map((d) => d.toObject({ getters: true })) });
} catch (err) {
return next(new HttpError("Fetching data failed", 500));
}
};

// 🎯 Get Dummy by ID
const getDummyById = async (req, res, next) => {
const dummyId = req.params.id;
try {
const dummy = await DummyModel.findById(dummyId);
if (!dummy) throw new HttpError("Not found", 404);
res.json({ dummy: dummy.toObject({ getters: true }) });
} catch (err) {
return next(new HttpError("Error fetching dummy", 500));
}
};

// 🎯 Create Dummy Record
const createDummy = async (req, res, next) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return next(new HttpError("Validation failed", 422));
}

const { name, description } = req.body;

const newDummy = new DummyModel({
name,
description,
createdAt: formatDate(new Date()),
});

try {
await newDummy.save();
res.status(201).json({ dummy: newDummy });
} catch (err) {
return next(new HttpError("Error creating dummy", 500));
}
};

// 🎯 Update Dummy Record
const updateDummy = async (req, res, next) => {
const dummyId = req.params.id;

try {
const dummy = await DummyModel.findById(dummyId);
if (!dummy) return next(new HttpError("Not found", 404));

    dummy.name = req.body.name;
    dummy.description = req.body.description;

    await dummy.save();
    res.status(200).json({ dummy });

} catch (err) {
return next(new HttpError("Error updating dummy", 500));
}
};

// 🎯 Delete Dummy Record
const deleteDummy = async (req, res, next) => {
const dummyId = req.params.id;

try {
const dummy = await DummyModel.findById(dummyId);
if (!dummy) return next(new HttpError("Not found", 404));

    await dummy.deleteOne();
    res.status(200).json({ message: "Deleted successfully" });

} catch (err) {
return next(new HttpError("Delete failed", 500));
}
};

// 🚀 Export Controller Methods
module.exports = {
getAllDummies,
getDummyById,
createDummy,
updateDummy,
deleteDummy,
};
