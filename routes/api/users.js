const express = require("express");

const router = express.Router();

router.get("/", function(req,res){
    res.json("this is a json status code for the users api")
});

module.exports = router;