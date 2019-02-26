const express                             = require("express");
const { check, validationResult }         = require("express-validator/check");
const crypto                              = require("crypto");

const router                              = express.Router();

const apiKey                              = "key-820ec8fedd020cd2c1e32edfa345779b";
const domain                              = "vohzd.com";
const mailgun                             = require("mailgun-js")({ apiKey, domain });

router.post("/send", (req, res) => {
  const token = crypto.randomBytes(20).toString("hex");
    const email = {
      from: "Express Reset <noreply@vohzd.com>",
      to: req.body.email,
      subject: "Password Reset for Express",
      html: `<h1>Please enter this token</h1><h3>${token}</h3>`
    };

    mailgun.messages().send(email, (err, body) => {
      console.log(body);
      res.status(200).send("SUP BITCHTITS");
    });

    //req.body.email
});

module.exports = router;
