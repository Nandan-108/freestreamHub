const express = require("express");
const { authenticateUser, verifyAdmin } = require("../controllers/authenticator");
const { getUsers, updateWebsiteUrl, getWebsites, updateWebsite } = require("../database");
const router = express.Router()


router.use(authenticateUser, verifyAdmin);



router.get("/status", (req, res)=> {
    const status = {
        "Status": "Running"
    };
    res.send(status);
});
 
router.get("/websites", async (req, res)=>{
    try {
        const websites = await getWebsites();
        res.send(websites);
    } catch (e) {
        console.log("Error fetching websites for edit: ", e);
        return []
    }
}) 

router.post("/updatewebsite", async (req, res) => {
    console.log("Updating website data: ", req.body.name);
    try {
        const {site_id, name, url, category, active} = req.body;
        const website = await updateWebsite(site_id, name, url, category, active);
        res.status(200).send(website)
    } catch (e) {
        console.log("Error: ", e);
        res.status(500).send("Error updating website");
    }
})

module.exports = router