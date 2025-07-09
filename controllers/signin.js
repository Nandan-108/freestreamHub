const { getUserWithEmail } = require("../database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await getUserWithEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign({ username: user.username }, config.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 34560000000, // 400 days
    });

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).render("signin", { errorMessage: "Login failed" });
  }
};
