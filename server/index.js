const express                       = require("express");
const mongoose                      = require("mongoose");
const bodyParser                    = require("body-parser");
const cookieParser                  = require("cookie-parser");
const passport                      = require("passport");
const port                          = 1337;
const app                           = express();

/*
 *   SERVER CONFIG
 */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

/*
 *   DB CONFIG
 */

mongoose.connect("mongodb://127.0.0.1/jwt", { useNewUrlParser: true });
mongoose.connection.on("error", error => console.log(error));

/*
 *   MIDDLEWARE
 */

require("../middleware/auth.js");

/*
 *   ROUTES
 */
const userRoutes                     = require("../routes/user/index.js");
const emailRoutes                    = require("../routes/email/index.js");

app.use("/", userRoutes);
app.use("/", emailRoutes);

/*
 *   START SERVER
 */

app.listen(port, () => {
  console.log(`working on ${port}`);
});

//app.use("/user", passport.authenticate("jwt", { session: false }), secureRoutes);
/*
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.json({ error: err });
});*/
