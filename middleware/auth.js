const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../model/user.js");
const jwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;

passport.use(new jwtStrategy({
  secretOrKey: "secret-phrase",
  jwtFromRequest: extractJwt.fromUrlQueryParameter("secret_token")
}, async (token, done) => {
  try {
    return done(null, token.user);
  }
  catch (error) {
    done (error);
  }
}))

passport.use("register", new localStrategy({
  usernameField: "email",
  passwordField: "password"
}, async (email, password, done) => {
  try {
    const user = await UserModel.create({ email, password });
    return done(null, user);
  }
  catch (e) { done(e) }
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
