const mysql = require("mysql2");
const dotenv = require("dotenv");
const config = require("./config");

const sql_pool = mysql
  .createPool({
    host: config.SQL_HOST,
    user: config.SQL_USER,
    password: config.SQL_PASSWORD,
    database: config.SQL_DATABASE,
    port: config.SQL_PORT,
    multipleStatements: true,
  })
  .promise();

console.log("Connected to MySQL...");

const getUsers = async () => {
  const [users] = await sql_pool.query("SELECT * FROM users");
  return users;
};

const getUserWithUsernameOrEmail = async (username, email) => {
  const [user] = await sql_pool.query(
    "SELECT username FROM users WHERE username = ? OR email = ?",
    [username, email]
  );
  return user;
};

const addUser = async (username, email, password) => {
  const result = await sql_pool.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password]
  );
  return result;
};

const addWebsiteToDb = async (name, url, websiteType, logo_url) => {
  let category = 0;
  if (websiteType.includes("movies")) category |= 1;
  if (websiteType.includes("anime")) category |= 2;
  if (websiteType.includes("sports")) category |= 4;

  const website = await sql_pool.query(
    "INSERT INTO websites (name, url, category, logo_url) VALUES (?, ?, ?, ?)",
    [name, url, category, logo_url]
  );

  return website; 
}; 

const getWebsites = async () => {
  const [websites] = await sql_pool.query("SELECT * FROM websites");
  return websites;
};

const getUserWithEmail = async (email) => {
  const [user] = await sql_pool.query(
    "SELECT username, email, password, admin FROM users WHERE email = ?",
    [email]
  );
  return user;
};

const getUserWithUsername = async (username) => {
  const [user] = await sql_pool.query(
    "SELECT username, email, admin FROM users WHERE username = ?",
    [username]
  );
  return user[0];
};

const getWebsitesWithRatedOrNot = async (username = "") => {
  const [websites] = await sql_pool.query(
    "SELECT websites.*, rate.rating AS user_rating, rate.username AS rating_username, rate.create_time AS create_time FROM websites LEFT JOIN (SELECT * FROM ratings WHERE username = ?) AS rate USING (site_id) ORDER BY rating DESC",
    [username]
  );
  // |name|url|site_id|rating|no_of_ratings|category|logo_url|user_rating|rating_username|create_time|
  return websites;
};

const addRating = async (site_id, username, rating) => {

  if (isNaN(rating) || isNaN(site_id)) {
    throw Error("Invalid arguments");
  }
  console.log("db.js: ", rating, site_id, username);
  const [websites] = await sql_pool.query(
    "SELECT * FROM websites WHERE site_id = ?",
    [site_id]
  );
  const website = websites[0];

  if (!website) throw new Error("Website not found");

  const [ratings] = await sql_pool.query(
    "SELECT * FROM ratings WHERE site_id = ? AND username = ?",
    [site_id, username]
  );

  if (ratings.length > 0)
    throw new Error("User has already rated this website");

  const newNoOfRatings = website.no_of_ratings + 1;
  const newRating =
    (website.rating * website.no_of_ratings + rating) / newNoOfRatings;

  // update ratings, and website table
  const [result] = await sql_pool.query(
    "BEGIN;" +
      "INSERT INTO ratings (site_id, username, rating) VALUES (?, ?, ?);" +
      "UPDATE websites SET no_of_ratings = ?, rating = ? WHERE site_id = ?;" +
      "COMMIT;",
    [site_id, username, rating, newNoOfRatings, newRating, site_id]
  );
  return result;
};

const updateWebsiteName = async (site_id, new_name) => {
  const [result] = await sql_pool.query(
    `UPDATE websites SET name=? WHERE site_id=?`,
    [new_name, site_id]
  );
  const [new_data] = await sql_pool.query(
    `SELECT * FROM websites WHERE site_id=?`,
    [site_id]
  );
  console.log("Updated website: ", new_data);
}
const updateWebsiteUrl = async (site_id, new_url) => {
  const [result] = await sql_pool.query(
    `UPDATE websites SET url=? WHERE site_id=?`,
    [new_url, site_id]
  );
  const [new_data] = await sql_pool.query(
    `SELECT * FROM websites WHERE site_id=?`,
    [site_id]
  );
  console.log("Updated website: ", new_data);
}

const getWebsite = async (site_id) => {
  try {
    const [website] = await sql_pool.query(`SELECT * FROM websites WHERE site_id=?`, 
      [site_id]);
    return website[0];
  } catch (e) {
    console.log("Error fetching website with id: ", site_id);
    return [];
  }
}

const updateWebsite = async (site_id, name, url, category, active) => {
  const [result] = await sql_pool.query(
    `UPDATE websites SET name=?, url=?, category=?, active=? WHERE site_id = ?`,
    [name, url, category, active, site_id]
  )
  console.log("Updated Website: ", result);
  const website = await getWebsite(site_id);
  return website;
}


module.exports = {
  sql_pool,
  addRating,
  getWebsitesWithRatedOrNot,
  getUserWithEmail,
  getUserWithUsername,
  getWebsites,
  addWebsiteToDb,
  getUsers,
  getUserWithUsernameOrEmail,
  addUser,
  updateWebsiteName,
  updateWebsiteUrl,
  updateWebsite
};
