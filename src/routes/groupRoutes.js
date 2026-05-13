const express = require("express");

const router = express.Router();

const {
  getSocket
} = require("../services/whatsapp");

router.get("/list", async (req, res) => {

  try {

    const sock = getSocket();

    const groups =
      await sock.groupFetchAllParticipating();

    const formatted =
      Object.values(groups)

      .map(g => ({

        id: g.id,

        name: g.subject,

        members:
          g.participants?.length || 0,

        mode:
          g.announce
          ? "ADMIN ONLY"
          : "OPEN",

        locked:
          g.restrict
          ? true
          : false,

        created:
          g.creation

      }))

      .sort((a, b) =>
        b.members - a.members
      );

    const analytics = {

      totalGroups:
        formatted.length,

      openGroups:
        formatted.filter(
          g => g.mode === "OPEN"
        ).length,

      adminOnly:
        formatted.filter(
          g => g.mode === "ADMIN ONLY"
        ).length,

      biggestGroup:
        formatted[0]

    };

    res.json({

      analytics,

      groups: formatted

    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;
