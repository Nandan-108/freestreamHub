const { addUser, getUserWithUsernameOrEmail } = require("../database");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  hashedPassword = await bcrypt.hash(password, 12);

  const usersWithUsernameOrEmail = await getUserWithUsernameOrEmail(
    username,
    email
  );
  if (usersWithUsernameOrEmail.length > 0) {
    res.render("signup", { errorMessage: "User already exists" });
  } else {
    const result = await addUser(username, email, hashedPassword);
  }

  res.render("signin", { successMessage: "User signed up successfully" });
};
