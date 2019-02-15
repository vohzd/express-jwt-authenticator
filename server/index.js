const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const port = 1337;
const app = express();

const UserModel = require("../model/user.js");

mongoose.connect("mongodb://127.0.0.1/jwt");
mongoose.connection.on("error", error => console.log(error));
//mongoose.Promise = global.promise;

require("../middleware/auth.js");

app.use(bodyParser.urlencoded({ extended: false }));

const routes = require("../routes/routes.js");
const secureRoutes = require("../routes/secure-routes.js");

app.use("/", routes);
app.use("/user", passport.authenticate("jwt", { session: false }), secureRoutes);
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.json({ error: err });
});
app.listen(port, () => {
  console.log(`working on ${port}`);
});

/*

http.listen(app.get("port"), () => {
  console.log(`listening on ${app.get("port")}`);
});
*/
