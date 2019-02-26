const express                             = require("express");
const { check, validationResult }         = require("express-validator/check");

const router                              = express.Router();

router.get("send", (req, res) => {
    console.log("NOWT HERE M8")
    res.status(200).send("SUP BITCHTITS");
});

module.exports = router;
