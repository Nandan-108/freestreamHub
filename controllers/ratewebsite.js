const { addRating } = require("../database");

exports.ratewebsite = async (req, res) => {
  try {
    const username = req.username;
    const [site_id, rating] = [
      parseInt(req.body.site_id),
      parseInt(req.body.rating),
    ];

    await addRating(site_id, username, rating);
    res.redirect("/");

  } catch (e) {
    res.send("Error rating website: " + e.message);
    return;
  }
};
