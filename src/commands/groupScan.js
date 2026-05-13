const fs = require("fs");

module.exports = async (
sock,
jid
) => {

try {

const imagePath =
"./src/media/groupscan.jpg";

if (!fs.existsSync(imagePath)) {

await sock.sendMessage(
jid,
{
text:
"❌ groupscan.jpg missing"
}
);

return;
}

/*
START SCAN MESSAGE
*/
const scanMsg =
await sock.sendMessage(
jid,
{
image: fs.readFileSync(imagePath),

caption:
`╔════════════════╗
🔍 SCANNING ALL GROUPS
╚════════════════╝

░░░░░░░░░░ 0%

⚡ Initializing scan engine...
🤖 SHELBY ALPHA BOT`
}
);

/*
FETCH GROUPS
*/
const groups =
await sock.groupFetchAllParticipating();

const groupList =
Object.values(groups);

const total =
groupList.length;

let openGroups = 0;
let closedGroups = 0;

/*
LIVE PROGRESS
*/
const progressSteps = [

"█░░░░░░░░░ 10%",
"██░░░░░░░░ 20%",
"███░░░░░░░ 30%",
"████░░░░░░ 40%",
"█████░░░░░ 50%",
"██████░░░░ 60%",
"███████░░░ 70%",
"████████░░ 80%",
"█████████░ 90%",
"██████████ 100%"

];

for (
let i = 0;
i < progressSteps.length;
i++
) {

await sock.sendMessage(
jid,
{
text:
`╔════════════════╗
🔍 SCANNING ALL GROUPS
╚════════════════╝

${progressSteps[i]}

⚡ Intelligent scan running...
🤖 SHELBY ALPHA BOT`,
edit: scanMsg.key
}
);

await new Promise(
resolve =>
setTimeout(resolve, 500)
);

}

/*
REAL SCAN
*/
for (const group of groupList) {

if (group.announce === true) {

closedGroups++;

} else {

openGroups++;

}

}

/*
FINAL REPORT
*/
await sock.sendMessage(
jid,
{
image: fs.readFileSync(imagePath),

caption:
`╔════════════════╗
✅ SCANNING COMPLETE
╚════════════════╝

██████████ 100%

🟢 Open Groups : ${openGroups}
🔴 Closed Groups : ${closedGroups}
📦 Total Groups : ${total}

⚡ Intelligent Scan Complete
🤖 SHELBY ALPHA BOT`,

footer:
"SHELBY ALPHA BOT",

buttons: [

{
buttonId:
".groupscan",

buttonText: {
displayText:
"🔄 RESCAN"
},

type: 1
},

{
buttonId:
".close",

buttonText: {
displayText:
"❌ CLOSE"
},

type: 1
}

],

headerType: 4

}
);

} catch (err) {

console.log(
"GROUPSCAN ERROR:",
err.message
);

}

};
