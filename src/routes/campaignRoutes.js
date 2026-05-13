const express = require("express");

const router = express.Router();

const Campaign =
require("../models/Campaign");

router.post("/create", async (req, res) => {

  try {

    const campaign =
      await Campaign.create(req.body);

    res.json({
      success: true,
      campaign
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

router.get("/all", async (req, res) => {

  try {

    const campaigns =
      await Campaign.find()
      .sort({ createdAt: -1 });

    res.json({
      total: campaigns.length,
      campaigns
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

router.post("/activate/:id", async (req, res) => {

  try {

    const campaign =
      await Campaign.findByIdAndUpdate(

        req.params.id,

        {
          active: true
        },

        {
          new: true
        }

      );

    res.json({
      success: true,
      campaign
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

router.post("/stop/:id", async (req, res) => {

  try {

    const campaign =
      await Campaign.findByIdAndUpdate(

        req.params.id,

        {
          active: false
        },

        {
          new: true
        }

      );

    res.json({
      success: true,
      campaign
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;
