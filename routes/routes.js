const express                             = require("express");
const passport                            = require("passport");
const jwt                                 = require("jsonwebtoken");
const { check, validationResult }         = require("express-validator/check");

const UserModel = require("../model/user.js");

const router = express.Router();

router.get("/user/:email", [ check("email").isEmail() ], async (req, res, next) => {
  const anyErrors = validationResult(req);
  if (!anyErrors.isEmpty()){
    res.status(422).json({ errors: anyErrors.array() })
  }
  else {
    let user = await UserModel.find({
      "email": req.params.email.toLowerCase()
    });
    res.send({
      "userExists": user.length > 0 ? true : false
    });
  };
});

router.post("/register", passport.authenticate("register", { session: false }), async (req, res, next) => {
  res.json({
    message: "success",
    user: req.user
  });
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user){
        const error = new Error("An Error occured");
        return next(error);
      }
      req.login(user, { session: false }, async (error) => {
        if (error){
          return next(error);
        }
      });
      const body = { _id: user._id, email: user.email };
      const token = jwt.sign({ user: body }, "secret_token");
      return res.json({ token });
    }
    catch (error){
      return next(error);
    }
  })(req, res, next)
});

module.exports = router;
