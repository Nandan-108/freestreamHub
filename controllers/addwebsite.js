const { addWebsiteToDb } = require("../database");
const { uploadFile, deleteFile } = require("../utils/awsutil");

exports.addwebsite = async (req, res) => {
  const { websiteName, websiteUrl, websiteType } = req.body;
  try {
    const fileName = await uploadFile(req.file);
    try {
      await addWebsiteToDb(websiteName, websiteUrl, websiteType, fileName);
      return res.render("addwebsite", {
        successMessage: "Website added successfully",
      });
    } catch (error) {
      console.error("Error adding website", error);
      await deleteFile(fileName);
      return res.render("addwebsite", { errorMessage: "Error adding website" });
    }
  } catch (error) {
    console.error("Error uploading file", error);
    return res.render("addwebsite", { errorMessage: "Error uploading file" });
  }
};
