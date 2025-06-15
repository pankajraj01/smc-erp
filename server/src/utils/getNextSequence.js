// Import Models
const Counter = require("../models/utils/counter.model");

const getNextSequence = async (sequenceName) => {
  const result = await Counter.findByIdAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return String(result.seq);
};

module.exports = getNextSequence;
