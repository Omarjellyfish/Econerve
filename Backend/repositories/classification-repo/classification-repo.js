const Classification = require("../../models/Classification-model"); // Adjust path if necessary

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

// Dummy data addition function
const addDummyClassification = async () => {
  try {
    // Create dummy classification data
    const dummyData = {
      companyName: "jellyfish", // Example company name
      classifications: [
        {
          classification: "Plastic",
          img: Buffer.from("dummyimage", "utf-8"), // Dummy image data, replace with actual image data if needed
          createdAt: new Date(),
          value: 0.1, // Example value
        },
        {
          classification: "Paper",
          img: Buffer.from("dummyimage", "utf-8"),
          createdAt: new Date(),
          value: 0.05,
        },
        {
          classification: "Metal",
          img: Buffer.from("dummyimage", "utf-8"),
          createdAt: new Date(),
          value: 0.12,
        },
      ],
    };

    // Create a new Classification entry in the database
    const classificationData = new Classification(dummyData);

    // Save the dummy classification data to the database
    await classificationData.save();
    console.log("Dummy data added successfully");
  } catch (err) {
    console.error("Error adding dummy data:", err);
    throw new Error("Error adding dummy data");
  }
};

module.exports = {
  addClassification,
  getClassificationsByCompany,
  addDummyClassification,
};
