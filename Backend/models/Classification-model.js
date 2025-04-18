const mongoose = require("mongoose");

const classificationSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  classifications: [
    {
      classification: { type: String, required: true },
      img: { type: Buffer, required: true },
      createdAt: { type: Date, default: Date.now },
      value: { type: Number, required: true },
    },
  ],
});

const Classification = mongoose.model("Classification", classificationSchema);

module.exports = Classification;
