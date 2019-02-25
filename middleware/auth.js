const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../model/user.js");
const jwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;

const { secret } = require("../config/keys.js");

passport.use(new jwtStrategy({
  jwtFromRequest: req => req.cookies.jwt,
  secretOrKey: secret,
  //jwtFromRequest: extractJwt.fromUrlQueryParameter("secret_token")
},
(token, done) => {
  /*
  console.log(token);
  if (Date.now() > token.expires){
    return done("Expired.");
  }
  console.log(token);*/
  return done(null, token.user);
}))

passport.use("register", new localStrategy({
  usernameField: "email",
  passwordField: "password"
}, async (email, password, done) => {
  console.log("trying to register...");
  console.log(email);
  try {
    console.log("nah actually this was successful")
    const user = await UserModel.create({ email, password });
    console.log("user created...")
    console.log(user);
    return done(null, user);
  }
  catch (e) {
    console.log("caught an error??")
    done(e)
  }
}));

passport.use("login", new localStrategy({
  usernameField: "email",
  passwordField: "password"
}, async (email, password, done) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user){
      return done(null, false, { message: "User not found", success: false, code: 404 });
    }
    const validate = await user.isValidPassword(password);
    if (!validate){
      return done(null, false, { message: "Wrong Password", success: false, code: 401 });
    }
    return done(null, user, { message: "Logged in successfully", success: true, code: 200 });
  }
  catch (e) { return done(e); }
}));
