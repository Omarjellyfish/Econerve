const router = express.Router();
const classificationController = require("../../controllers/classfication-controller/classfication-controller");
router.get("/classify"); //directly acess the model to get a classification
router.get("/getClassfication", classificationController.getClassification);
router.get(
  "/getData/:companyname",
  authenticateToken,
  classificationController.getClassificationsByCompany
);

export default router;
