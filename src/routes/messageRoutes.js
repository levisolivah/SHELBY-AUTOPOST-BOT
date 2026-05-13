const express = require("express");

const router = express.Router();

const {
  getSocket
} = require("../services/whatsapp");

router.post("/send", async (req, res) => {

  try {

    const {
      number,
      message
    } = req.body;

    if (!number || !message) {

      return res.status(400).json({
        message: "Number and message required"
      });

    }

    const sock = getSocket();

    const jid =
      number + "@s.whatsapp.net";

    await sock.sendMessage(jid, {
      text: message
    });

    res.json({
      success: true,
      message: "Message sent"
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;
