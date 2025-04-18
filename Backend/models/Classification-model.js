const mongoose = require("mongoose");

const classificationSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  classifications: [
    {
      img: {
        type: Buffer,
        required: true,
      },
      classification: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      value: {
        type: Number,
        default: 0,
      },
    },
  ],
});

// Price map based on classification
const priceMap = {
  paper: 0.05,
  glass: 0.1,
  plastic: 0.08,
  metal: 0.12,
};

// Hook to calculate value before saving
classificationSchema.pre("save", function (next) {
  if (this.classifications && this.classifications.length) {
    this.classifications = this.classifications.map((item) => {
      const price = priceMap[item.classification.toLowerCase()] || 0;
      return {
        ...item,
        value: price,
      };
    });
  }
  next();
});

const ClassificationModel = mongoose.model(
  "Classification",
  classificationSchema
);
module.exports = ClassificationModel;
