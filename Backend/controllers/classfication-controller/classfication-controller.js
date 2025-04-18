const {
  addClassification,
  getClassificationsByCompany,
  addDummyClassification,
} = require("../../repositories/classification-repo/classification-repo");

// Ensure classify() function is properly defined, this is a placeholder function
async function classify(img) {
  // For testing, you can replace this with your classification logic
  return "Plastic"; // Example classification, adjust to fit your model
}

// Handle classification request
const getClassification = async (req, res) => {
  const img = req.img; // Ensure `req.img` contains the image data
  const { companyName } = req.params; // Extract `companyName` from request params

  try {
    const classification = await classify(img); // Make sure `classify()` is defined

    if (!classification) {
      return res.status(404).json({ message: "Unable to reach the model" });
    }

    // Respond with classification result
    res
      .status(200)
      .json({ message: "Classification successful", result: classification });

    // Save classification after responding
    await addClassification(companyName, {
      classification: classification,
      img: img,
      createdAt: new Date(),
      value: 0.1, // Example value, adjust based on your classification model
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Server unresponsive", error: err.message });
  }
};

// Get classifications by company
const getClassificationsByCompanyHandler = async (req, res) => {
  const { companyName } = req.params;

  try {
    const classifications = await getClassificationsByCompany(companyName);
    if (!classifications) {
      return res
        .status(404)
        .json({ message: "No classifications found for this company" });
    }
    res.status(200).json(classifications);
  } catch (err) {
    console.error("Error retrieving classifications:", err);
    res
      .status(500)
      .json({
        message: "Error retrieving classifications",
        error: err.message,
      });
  }
};

// Example route to add dummy classification data
const addDummyClassificationHandler = async (req, res) => {
  try {
    await addDummyClassification();
    res.status(200).json({ message: "Dummy data added successfully" });
  } catch (err) {
    console.error("Error adding dummy data:", err);
    res
      .status(500)
      .json({ message: "Error adding dummy data", error: err.message });
  }
};

module.exports = {
  getClassification,
  getClassificationsByCompanyHandler,
  addDummyClassificationHandler,
};
