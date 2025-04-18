const Classification = require("../models/Classification-model");

// Add a classification under a company
const addClassification = async (companyName, classificationData) => {
  return await Classification.findOneAndUpdate(
    { companyName },
    { $push: { classifications: classificationData } },
    { new: true, upsert: true }
  );
};

// Get classifications by company
const getClassificationsByCompany = async (companyName) => {
  return await Classification.findOne({ companyName });
};

module.exports = {
  addClassification,
  getClassificationsByCompany,
};
