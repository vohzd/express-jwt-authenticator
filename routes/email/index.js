const express                             = require("express");
const { check, validationResult }         = require("express-validator/check");
const jwt                                 = require("jsonwebtoken");


const bcrypt                              = require("bcrypt");



const { secret }                          = require("../../config/keys.js");

const UserModel                           = require("../../model/user.js");

const router                              = express.Router();

const apiKey                              = "key-820ec8fedd020cd2c1e32edfa345779b";
const domain                              = "vohzd.com";
const mailgun                             = require("mailgun-js")({ apiKey, domain });

router.post("/request-password-reset", async (req, res) => {
  console.log("do something here plz");
  let user = await UserModel.find({
    "email": req.body.email.toLowerCase()
  });

  const payload = { id: user[0]["_id"] };

  console.log("REQUESTING TOKEN")
  //const token = jwt.sign({ id: user[0]["_id"] }, "12345");

  const token = jwt.sign(payload, user[0].password, { expiresIn: "1hr" });
  console.log(token);

  const email = {
    from: "Express Reset <noreply@vohzd.com>",
    to: req.body.email,
    subject: "Password Reset for Express",
    html: `<h1>Please enter this token</h1><a href='http://localhost:3000/reset?token=${token}&id=${user[0]._id}'>Click here</a>`
  };

  mailgun.messages().send(email, (err, body) => {
    console.log(body);
    res.status(200).send("SUP BITCHTITS");
  });

    //req.body.email
});

router.post("/perform-password-reset", async (req, response) => {

  const user = await UserModel.find({
    "_id": req.body.userId
  });

  //const y = JSON.stringify({ id: user[0]["_id"] });

  console.log("FOUND HIM... WE MUSTN't BURN HIM");

  jwt.verify(req.body.token, user[0].password, async (err, token) => {
    if (err){
      return response.status(401).send("whoops");
    }
    console.log("testing...");
    console.log(err);
    console.log(token);
    const hash = await bcrypt.hash(req.body.password, 10);

    UserModel.findOneAndUpdate({
      "_id": token.id
    }, {
      "password": hash
    }).then((r) => {
      console.log(r)
      return response.status(200).send("great!");
    });
  });
  /*
  try {
    const token = jwt.verify(req.body.token, user[0].password);

  }
  catch (e){
    console.log("swt jeez");
    console.log(e)
  }
  console.log(token);


  if (token.id){
    console.log("yes");

    UserModel.findOneAndUpdate({
      "_id": token.id
    }, {
      "password": "TESTING..."
    }).then((response) => {
      console.log(response)
      res.send({
        "message": "success"
      });
    });

  }
  else {
    console.log("something fucked up here majorly....");
  }*/

});

module.exports = router;
