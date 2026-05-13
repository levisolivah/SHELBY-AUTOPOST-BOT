const Campaign =
require("../models/Campaign");

const {
  getSocket
} = require("./whatsapp");

let running = false;

function delay(ms) {

  return new Promise(resolve =>
    setTimeout(resolve, ms)
  );

}

async function startCampaignEngine() {

  if (running) return;

  running = true;

  console.log(
    "🚀 Campaign Engine Started"
  );

  while (true) {

    try {

      const campaigns =
        await Campaign.find({
          active: true
        });

      for (const campaign of campaigns) {

        const sock = getSocket();

        for (const groupId of campaign.groups) {

          try {

            await sock.sendMessage(
              groupId,
              {
                text: campaign.message
              }
            );

            console.log(`
✅ SENT
📢 Campaign:
${campaign.name}

📍 Group:
${groupId}
            `);

          } catch (err) {

            console.log(`
❌ FAILED
📍 ${groupId}
${err.message}
            `);

          }

          await delay(
            campaign.delay * 1000
          );

        }

      }

      await delay(5000);

    } catch (err) {

      console.log(
        "❌ Engine Error:",
        err.message
      );

      await delay(5000);

    }

  }

}

module.exports = {
  startCampaignEngine
};
