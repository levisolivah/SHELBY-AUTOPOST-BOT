const fs =
require("fs");

/*
DATABASE
*/
const SAVE_FILE =
"./database/antilink.json";

/*
MEMORY
*/
let antiLinkGroups = {};

/*
LOAD
*/
try {

if (
fs.existsSync(SAVE_FILE)
) {

antiLinkGroups =
JSON.parse(
fs.readFileSync(
SAVE_FILE,
"utf8"
)
);

}

} catch {

antiLinkGroups = {};

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
SAVE
*/
function saveDatabase() {

fs.writeFileSync(
SAVE_FILE,
JSON.stringify(
antiLinkGroups,
null,
2
)
);

}

/*
LINK DETECTOR
*/
function containsBlockedLink(text) {

const regex =
/(https?:\/\/[^\s]+)|(chat\.whatsapp\.com\/[A-Za-z0-9]+)|(wa\.me\/\d+)|(t\.me\/)|(telegram\.me\/)|(discord\.gg\/)|(instagram\.com\/)|(facebook\.com\/)|(fb\.com\/)|(twitter\.com\/)|(x\.com\/)|(youtube\.com\/)|(youtu\.be\/)|(tiktok\.com\/)|(snapchat\.com\/)|(threads\.net\/)|(linkedin\.com\/)|(reddit\.com\/)/gi;

return regex.test(text);

}

/*
COMMAND
*/
module.exports = {

name: ".antilink",

async execute(
sock,
msg,
args,
text
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

/*
MODE
*/
const mode =
args[1]?.toLowerCase();

/*
ENABLE
*/
if (
mode === "on"
) {

/*
ALREADY ON
*/
if (
antiLinkGroups[jid]
) {

await sock.sendMessage(
jid,
{
text:
"😌 Relax, AntiLink is already on."
}
);

return;

}

/*
TURN ON
*/
antiLinkGroups[
jid
] = true;

saveDatabase();

await sock.sendMessage(
jid,
{
text:
"🛡️ AntiLink has been turned on."
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

/*
ALREADY OFF
*/
if (
!antiLinkGroups[jid]
) {

await sock.sendMessage(
jid,
{
text:
"😌 Relax, AntiLink is already off."
}
);

return;

}

delete antiLinkGroups[
jid
];

saveDatabase();

await sock.sendMessage(
jid,
{
text:
"❌ AntiLink disabled."
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
`🛡️ ANTILINK MENU

.antilink on
.antilink off`
}
);

} catch (err) {

console.log(
"ANTILINK ERROR:",
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
ENABLED?
*/
if (
!antiLinkGroups[jid]
) {
return;
}

/*
IGNORE BOT OWN MESSAGES
*/
const botId =
sock.user.id
.split(":")[0] +
"@s.whatsapp.net";

const participant =
msg.key.participant || "";

if (
participant === botId
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
TEXT
*/
const text =
msg.message?.conversation ||

msg.message?.extendedTextMessage?.text ||

msg.message?.imageMessage?.caption ||

msg.message?.videoMessage?.caption ||

"";

if (!text) {
return;
}

/*
CHECK LINK
*/
if (
!containsBlockedLink(text)
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
DELETE MESSAGE
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

Links are not allowed here.

— Moderators`,
mentions: [sender]
}
);

console.log(
"LINK DELETED:",
sender
);

} catch (err) {

console.log(
"AUTO ANTILINK ERROR:",
err.message
);

}

};
