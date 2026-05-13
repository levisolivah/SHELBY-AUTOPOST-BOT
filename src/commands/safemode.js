const fs = require("fs");

/*
DATABASE
*/
const SAVE_FILE =
"./database/safemode.json";

/*
STATE
*/
let safeGroups = {};

/*
LOAD DATABASE
*/
try {

if (
fs.existsSync(SAVE_FILE)
) {

safeGroups = JSON.parse(
fs.readFileSync(
SAVE_FILE,
"utf8"
)
);

}

} catch {

safeGroups = {};

}

/*
CREATE DATABASE
*/
if (
!fs.existsSync("./database")
) {

fs.mkdirSync(
"./database"
);

}

if (
!fs.existsSync(SAVE_FILE)
) {

fs.writeFileSync(
SAVE_FILE,
"{}"
);

}

/*
SAVE DATABASE
*/
function saveDatabase() {

fs.writeFileSync(
SAVE_FILE,
JSON.stringify(
safeGroups,
null,
2
)
);

}

/*
COMMAND
*/
module.exports = {

name: ".safe",

async execute(
sock,
msg,
args
) {

try {

const jid =
msg.key.remoteJid;

/*
GROUP ONLY
*/
if (
!jid.endsWith("@g.us")
) {

await sock.sendMessage(
jid,
{
text:
"❌ This command only works in groups."
}
);

return;

}

const mode =
args[1]?.toLowerCase();

/*
ENABLE
*/
if (
mode === "on"
) {

if (
safeGroups[jid]
) {

await sock.sendMessage(
jid,
{
text:
"🛡️ Safe mode is already activated."
}
);

return;

}

safeGroups[jid] = true;

saveDatabase();

await sock.sendMessage(
jid,
{
text:
"🛡️ Safe mode activated."
}
);

return;

}

/*
DISABLE
*/
if (
mode === "off"
) {

if (
!safeGroups[jid]
) {

await sock.sendMessage(
jid,
{
text:
"🛡️ Safe mode is already off."
}
);

return;

}

delete safeGroups[jid];

saveDatabase();

await sock.sendMessage(
jid,
{
text:
"❌ Safe mode disabled."
}
);

return;

}

/*
MENU
*/
await sock.sendMessage(
jid,
{
text:
`🛡️ SAFE MODE MENU

.safe on
.safe off`
}
);

} catch (err) {

console.log(
"SAFE MODE ERROR:",
err.message
);

}

}

};

/*
AUTO PROTECTION
*/
module.exports.autoProtect =
async function (
sock,
msg
) {

try {

const jid =
msg.key.remoteJid;

/*
GROUP ONLY
*/
if (
!jid ||
!jid.endsWith("@g.us")
) {
return;
}

/*
ACTIVE?
*/
if (
!safeGroups[jid]
) {
return;
}

/*
IGNORE BOT
*/
if (
msg.key.fromMe
) {
return;
}

/*
SENDER
*/
const sender =
msg.key.participant;

if (!sender) {
return;
}

/*
MEDIA CHECK
*/
const hasImage =
!!msg.message?.imageMessage;

const hasVideo =
!!msg.message?.videoMessage;

/*
VIEW ONCE?
*/
const isViewOnce =
!!msg.message?.viewOnceMessageV2 ||
!!msg.message?.viewOnceMessage ||
!!msg.message?.viewOnceMessageV2Extension;

/*
DELETE OPEN MEDIA
*/
if (
(hasImage || hasVideo) &&
!isViewOnce
) {

/*
DELETE
*/
try {

await sock.sendMessage(
jid,
{
delete: msg.key
}
);

} catch {}

/*
WARNING
*/
await sock.sendMessage(
jid,
{
text:
`⚠️ @${sender.split("@")[0]}

Safe mode is activated,
kindly enable view once
for the group's safety.`,
mentions: [sender]
}
);

console.log(
"SAFE DELETE:",
sender
);

}

} catch (err) {

console.log(
"SAFE MODE AUTO ERROR:",
err.message
);

}

};
