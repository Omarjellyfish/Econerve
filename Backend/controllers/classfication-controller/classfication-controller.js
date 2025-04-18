import { addClassification } from "../../repositories/classification-repo/classification-repo";
import { getClassificationsByCompany } from "../../repositories/classification-repo/classification-repo";
export async function getClassification(req, res) {
  const img = req.img; // Ensure `req.img` contains the image data
  const { companyName } = req.body; // Extract `companyName` from request body

  try {
    const classification = await classify(img); //make the classify function

    if (!classification) {
      return res.status(404).json({ message: "Unable to reach the model" });
    }

    res
      .status(200)
      .json({ message: "Classification successful", result: classification });

    // Save classification after responding
    await addClassification({
      body: {
        companyName, // Ensure this is coming from the request
        classification,
        img,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server unresponsive" });
  }
}

export async function getClassificationsByCompany(companyName) {
  try {
    return await classificationRepo.getClassificationsByCompany(companyName);
  } catch (err) {
    console.error("Error retrieving classifications:", err);
    throw new Error("Database error");
  }
}
