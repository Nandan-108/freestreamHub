const {
  signInIfPossible,
  authenticateUser,
  verifyAdmin,
} = require("../controllers/authenticator");
const {
  getUserWithUsername,
  getWebsitesWithRatedOrNot,
  getWebsites,
} = require("../database");
const { generateSignedUrl } = require("../utils/awsutil");
const config = require("./../config")
const express = require("express");
const router = express.Router();

router.get("/", signInIfPossible, async (req, res, next) => {
  try {
    if (req.username) {
      const user = await getUserWithUsername(req.username);
      const websites = await getWebsitesWithRatedOrNot(req.username);
      const websitesWithSignedUrls = await Promise.all(
        websites.map(async (website) => {
          const signedUrl = await generateSignedUrl(website.logo_url);
          return {
            ...website,
            logo_url: signedUrl,
          };
        })
      );

      return res.render("index", {
        user: user,
        sites: websitesWithSignedUrls,
      });
    }

    const websites = await getWebsitesWithRatedOrNot();
    const websitesWithSignedUrls = await Promise.all(
      websites.map(async (website) => {
        const signedUrl = await generateSignedUrl(website.logo_url);
        return {
          ...website,
          logo_url: signedUrl,
        };
      })
    );
    res.render("index", {
      sites: websitesWithSignedUrls,
    });
  } catch (err) { 
    next(err);
  }
});

router.get("/addwebsite", authenticateUser, verifyAdmin, (req, res, next) => {
  try {
    res.render("addwebsite");
  } catch (error) {
    next(error);
  }
});

router.get("/editwebsite", authenticateUser, verifyAdmin, async (req, res, next) => {
  try {
    const websites = await getWebsites();
    res.render("editwebsite", {websites, API_URL: config.API_URL});
  } catch (error) {
    next(error);
  }
}); 


router.get("/signup", signInIfPossible, (req, res, next) => {
  try {
    if (req.username) res.redirect("/");
    res.render("signup");
  } catch (error) {
    next(error);
  }
});

router.get("/signin", signInIfPossible, (req, res, next) => {
  try {
    if (req.username) res.redirect("/");
    res.render("signin");
  } catch (error) {
    next(error);
  }
});

router.get("/signout", (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.get("/status", async (req, res) => {
  const status = {
    "Status": "Running"
  };
  res.send(status)
});

module.exports = router;
