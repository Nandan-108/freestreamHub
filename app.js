const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const hbs = require("hbs");
const cors = require("cors");
const { errorHandler, authenticateUser, verifyAdmin } = require("./controllers/authenticator");

const app = express();
// Configure CORS to allow all origins and common methods
// app.use(cors({
//   origin: ["http://freestreamhub.onrender.com", "http://localhost:3001"],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   optionsSuccessStatus: 200 // For legacy browser support
// }));

// // Handle preflight requests for all routes
// app.options('*', cors({
//   origin: ["http://freestreamhub.onrender.com", "http://localhost:3001"],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   optionsSuccessStatus: 200
// }));

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/", require("./routes/pages")); // This is the route for the pages
app.use("/auth", require("./routes/auth")); // This is the route for the pages
app.use("/api", require("./routes/api")); // This is for apis

app.use(errorHandler);

hbs.registerHelper("range", function (start, end) {
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
});

// Greater than or equal helper
hbs.registerHelper("gte", function (a, b) {
  return a >= b;
});

// Less than helper
hbs.registerHelper("lt", function (a, b) {
  return a < b;
});
hbs.registerHelper("and", function (a, b) {
  return a && b;
});

hbs.registerHelper("isnull", function (a) {
  return a === null;
});

// Subtraction helper
hbs.registerHelper("subtract", function (a, b) {
  return a - b;
});

hbs.registerHelper("not", function (a) {
  return !a;
});

app.set("view engine", "hbs");
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
