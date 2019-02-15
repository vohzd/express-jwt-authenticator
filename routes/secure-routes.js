const express = require("express");
const router = express.Router();

router.get("/profile", (req, res, next) => {
  res.json({
    message: "You made it to the secure bit of the site",
    user: req.user,
    token: req.query.secret_token
  });
});

module.exports = router;
