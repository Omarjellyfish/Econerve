const express = require("express");
const userController = require("../controllers/user-controller");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refresh", userController.refresh);
router.post("/logout", userController.logout);

module.exports = router;
