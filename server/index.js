const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const port = 1337;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect("mongodb://127.0.0.1/jwt", { useNewUrlParser: true });
mongoose.connection.on("error", error => console.log(error));

require("../middleware/auth.js");

const routes = require("../routes/routes.js");
const secureRoutes = require("../routes/secure-routes.js");

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  //res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

app.use("/", routes);
//app.use("/user", passport.authenticate("jwt", { session: false }), secureRoutes);
/*
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.json({ error: err });
});*/
app.listen(port, () => {
  console.log(`working on ${port}`);
});

/*

http.listen(app.get("port"), () => {
  console.log(`listening on ${app.get("port")}`);
});
*/
