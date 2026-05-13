const fs =
require("fs");

/*
DATABASE
*/
const SAVE_FILE =
"./database/workers.json";

/*
TARGET GROUP
*/
const TARGET_GROUP =
"120363427652407744@g.us";

/*
MEMORY
*/
let workers = {};

/*
LOAD
*/
try {

if (
fs.existsSync(SAVE_FILE)
) {

workers =
JSON.parse(
fs.readFileSync(
SAVE_FILE,
"utf8"
)
);

}

} catch {

workers = {};

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
function saveWorkers() {

fs.writeFileSync(
SAVE_FILE,
JSON.stringify(
workers,
null,
2
)
);

}

/*
COMMAND
*/
module.exports = {

name: ".work",

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
REPLY ONLY
*/
const quoted =
msg.message?.extendedTextMessage
?.contextInfo;

if (!quoted) {

await sock.sendMessage(
jid,
{
text:
"❌ Reply to a user's message with .work"
}
);

return;

}

/*
TARGET USER
*/
const participant =
quoted.participant;

if (!participant) {

await sock.sendMessage(
jid,
{
text:
"❌ Could not detect user."
}
);

return;

}

/*
SAVE WORKER
*/
workers[
participant
] = {

active: true,
addedIn: jid,
time:
new Date()
.toISOString()

};

saveWorkers();

/*
SUCCESS
*/
await sock.sendMessage(
jid,
{
text:
"✅ Worker added successfully."
}
);

} catch (err) {

console.log(
"WORK COMMAND ERROR:",
err.message
);

}

}

};

/*
AUTO TRACKER
*/
module.exports.autoTrack =
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

if (
!sender
) {
return;
}

/*
NOT WORKER
*/
if (
!workers[sender]
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
GROUP NAME
*/
let groupName =
"Unknown Group";

try {

const metadata =
await sock.groupMetadata(
jid
);

groupName =
metadata.subject;

} catch {}

/*
FORWARD
*/
const report =
`📡 *LOADER*

👥 Group:
${groupName}

📝 *${text}*

👤 Sender:
${sender}`;

await sock.sendMessage(
TARGET_GROUP,
{
text: report
}
);

console.log(
"WORK FORWARDED:",
sender
);

} catch (err) {

console.log(
"AUTO TRACK ERROR:",
err.message
);

}

};
