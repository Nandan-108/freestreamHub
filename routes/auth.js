const express = require("express");
const multer = require("multer");
const signupController = require("../controllers/signup.js");
const signinController = require("../controllers/signin.js");
const addWebsiteController = require("../controllers/addwebsite.js");
const addRatingController = require("../controllers/ratewebsite.js");
const { authenticateUser } = require("../controllers/authenticator.js");
 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/signup", signupController.signup);

router.post("/signin", signinController.signin);

router.post(
  "/addwebsite",
  upload.single("websiteImage"),
  addWebsiteController.addwebsite
);

router.post("/rate", authenticateUser, addRatingController.ratewebsite);

module.exports = router;
