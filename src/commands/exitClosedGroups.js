const fs = require("fs");

module.exports = async (
sock,
jid
) => {

try {

const imagePath =
"./src/media/groupscan.jpg";

/*
CHECK IMAGE
*/
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
START REPORT
*/
await sock.sendMessage(
jid,
{
image: fs.readFileSync(imagePath),

caption:
`╔════════════════════╗
🚪 EXIT CLOSED GROUPS
╚════════════════════╝

🔍 Intelligent Scan Started...

⚡ Detecting closed groups
🛡️ Protecting bot-admin groups
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

/*
BOT IDS
*/
const botIds = [

sock.user.id,

sock.user.id.split(":")[0] +
"@s.whatsapp.net",

sock.user.id.split(":")[0] +
"@lid"

];

let exited = 0;
let protectedGroups = 0;
let closedFound = 0;
let failed = 0;

/*
SCAN GROUPS
*/
for (const group of groupList) {

try {

/*
VALID GROUP
*/
if (
!group.id.endsWith("@g.us")
) {
continue;
}

/*
DETECT CLOSED
*/
const isClosed =
group.announce === true;

if (!isClosed) {
continue;
}

/*
IGNORE ANNOUNCEMENT HUBS
*/
if (
group.subject
.toLowerCase()
.includes("announcement")
) {
continue;
}

closedFound++;

/*
BOT PARTICIPANT
*/
const participant =
group.participants.find(
p =>
botIds.includes(p.id)
);

/*
BOT ADMIN?
*/
const botIsAdmin =
participant?.admin
? true
: false;

/*
PROTECTED
*/
if (botIsAdmin) {

protectedGroups++;

await sock.sendMessage(
jid,
{
text:
`🛡️ PROTECTED GROUP

📌 Group Name:
${group.subject}

🆔 Group UID:
${group.id}

👥 Members:
${group.size}

⚡ Bot is admin
🚫 Group preserved`
}
);

continue;
}

/*
LEAVING
*/
await sock.sendMessage(
jid,
{
text:
`🚪 LEAVING CLOSED GROUP

📌 Group Name:
${group.subject}

🆔 Group UID:
${group.id}

👥 Members:
${group.size}

⚡ Leaving group...`
}
);

/*
LEAVE
*/
await sock.groupLeave(
group.id
);

exited++;

/*
CONFIRMATION
*/
await sock.sendMessage(
jid,
{
text:
`✅ SUCCESSFULLY EXITED

You left "${group.subject}" successfully.

🆔 Group UID:
${group.id}`
}
);

await new Promise(
resolve =>
setTimeout(resolve, 1200)
);

} catch (err) {

failed++;

console.log(
"EXIT ERROR:",
err.message
);

}

}

/*
NO CLOSED GROUPS
*/
if (closedFound === 0) {

await sock.sendMessage(
jid,
{
text:
"✅ No closed groups detected."
}
);

return;
}

/*
FINAL REPORT
*/
await sock.sendMessage(
jid,
{
image: fs.readFileSync(imagePath),

caption:
`╔════════════════════╗
✅ CLEANUP COMPLETE
╚════════════════════╝

🚪 Groups Exited:
${exited}

🛡️ Protected Groups:
${protectedGroups}

⚠️ Failed Operations:
${failed}

📦 Closed Groups Found:
${closedFound}

⚡ Intelligent Cleanup Complete
🤖 SHELBY ALPHA BOT`
}
);

} catch (err) {

console.log(
"EXIT CLOSED ERROR:",
err.message
);

}

};
