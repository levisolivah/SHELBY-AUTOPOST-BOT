const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

router.get("/profile", auth, (req, res) => {

  res.json({
    message: "Protected profile access granted",
    user: req.user
  });

});

module.exports = router;
