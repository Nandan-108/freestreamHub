const jwt = require("jsonwebtoken");
const { getUserWithUsername } = require("../database");

const config = require("./../config");

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
};

const signInIfPossible = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      next();
      return;
    }

    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (!err) req.username = decoded.username;
      next();
    });
  } catch (error) {
    next(error);
  }
};

const authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("Token: ", token);
    // console.log("Req", req);
    if (!token) return res.status(401).send("Access denied");

    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).send("Invalid token");
      req.username = decoded.username;
      next();
    });
  } catch (error) {
    next(error);
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const username = req.username;
    const user = await getUserWithUsername(username);
    if (user.admin) next();
    else res.status(403).send("Unauthorized");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  errorHandler,
  signInIfPossible,
  authenticateUser,
  verifyAdmin,
};
