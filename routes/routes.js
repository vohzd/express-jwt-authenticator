const express                             = require("express");
const passport                            = require("passport");
const jwt                                 = require("jsonwebtoken");
const { check, validationResult }         = require("express-validator/check");

const UserModel                           = require("../model/user.js");

const { secret }                          = require("../config/keys.js");

const router                               = express.Router();

/*
router.get("/checkAuthState", passport.authenticate("jwt", { session: false }), (req, res) => {
  console.log("checking auth state....");
  console.log(req.user);
}));





router.get("/checkAuthState", (req, res) => {
  console.log(req.headers);
  console.log("ABOUT TO TEST");
  try {
    passport.authenticate("jwt", { session: false }, (req2, res2) => {
      console.log("PASSPORT HAS DONE SOMETHING");
      console.log(req2);
    });
  }
  catch (e){
    console.log(e);
  }


  res.send("CHECKED AUTH STATE");
});




router.get("/checkAuthState", passport.authenticate("jwt", { session: false}), (req, res) => {
  res.status(200).send({ user });
});
*/
router.get('/checkAuthState', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log("WELCOME BACK!!!!")
    res.status(200).send(req.user);
});

router.get("/user/:email", [ check("email").isEmail() ], async (req, res, next) => {
  const anyErrors = validationResult(req);
  if (!anyErrors.isEmpty()){
    res.status(422).json({ errors: anyErrors.array() })
  }
  else {
    let user = await UserModel.find({
      "email": req.params.email.toLowerCase()
    });
    console.log("checking user...");
    res.send({
      "userExists": user.length > 0 ? true : false
    });
  };
});

router.post("/register", passport.authenticate("register", { session: false }), async (req, res, next) => {
  console.log("received a request to regsiter a user....")
  try {
    res.json({
      message: "success",
      user: {
        _id: req.user._id,
        email: req.user.email
      }
    });
  }
  catch (e){
    console.log("borked");
    console.log(e);
  }
});

router.post("/login", async (req, res, next) => {

  passport.authenticate("login", async (err, user, info) => {

    req.login(user, { session: false }, (error) => {
      if (error){
        res.status(400).send({ error });
      }
    });

    const cookieOptions = {
      maxAge: 1000 * 60 * 10,
      httpOnly: true,
      secure: false,
      signed: false,
      sameSite: false
    };

    const userOptions = {
      user: user.email
    }

    const token = jwt.sign(userOptions, secret, { expiresIn: "1hr" });

    res.cookie("jwt", token, cookieOptions);
    res.status(200).send(user.email);

  })(req, res)
});

module.exports = router;
