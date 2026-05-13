const loaders = {};
const tracker = {};
const sentPosts = new Set();

const ADMIN_GROUP =
"120363427652407744@g.us";

/*
NORMALIZE
*/
function normalize(text) {

return (text || "")
.toLowerCase()
.replace(/https?:\/\/\S+/g, "")
.replace(/[^\w\s]/g, "")
.replace(/\s+/g, " ")
.trim();

}

/*
EXTRACT NUMBER
*/
function extractNumber(sender) {

if (
sender.includes("@lid")
) {

return sender;

}

return sender
.replace("@s.whatsapp.net", "");

}

/*
BUILD MESSAGE
*/
function buildMessage(
number,
groupName,
text
) {

return `*LOADER REPORT*

*GROUP:*
*${groupName}*

*NUMBER:*
*${number}*

*MESSAGE:*

*${text}*`;

}

/*
ADD LOADER
*/
function addLoader(user) {

loaders[user] = true;

}

/*
CHECK LOADER
*/
function isLoader(user) {

return loaders[user] === true;

}

/*
.WORK
*/
async function forwardWork(
sock,
msg
) {

try {

const jid =
msg.key.remoteJid;

/*
GROUP NAME
*/
const metadata =
await sock.groupMetadata(
jid
);

const groupName =
metadata.subject;

/*
CONTEXT
*/
const context =
msg.message?.extendedTextMessage
?.contextInfo;

if (!context) {
return;
}

/*
SENDER
*/
const sender =
context.participant;

/*
MARK
*/
addLoader(sender);

/*
QUOTED
*/
const quoted =
context.quotedMessage;

let quotedText = "";

if (
quoted?.conversation
) {

quotedText =
quoted.conversation;

} else if (
quoted?.extendedTextMessage?.text
) {

quotedText =
quoted.extendedTextMessage.text;

}

/*
NUMBER
*/
const number =
extractNumber(sender);

/*
SEND
*/
if (quotedText) {

const final =
buildMessage(
number,
groupName,
quotedText
);

await sock.sendMessage(
ADMIN_GROUP,
{
text: final
}
);

}

/*
✓ REACTION
*/
await sock.sendMessage(
jid,
{
react: {
text: "✓",
key: msg.key
}
}
);

} catch (err) {

console.log(
"WORK ERROR:",
err.message
);

}

}

/*
AUTO TRACK
*/
async function autoScanWorkers(
sock,
msg
) {

try {

/*
GROUP ONLY
*/
const jid =
msg.key.remoteJid;

if (
!jid.endsWith("@g.us")
) {
return;
}

/*
GROUP NAME
*/
const metadata =
await sock.groupMetadata(
jid
);

const groupName =
metadata.subject;

/*
SENDER
*/
const sender =
msg.key.participant;

if (!sender) {
return;
}

/*
LOADER?
*/
if (
!isLoader(sender)
) {
return;
}

/*
TEXT
*/
const text =
msg.message?.conversation ||
msg.message?.extendedTextMessage?.text;

if (!text) {
return;
}

/*
IGNORE COMMANDS
*/
if (
text.startsWith(".")
) {
return;
}

/*
NORMALIZE
*/
const clean =
normalize(text);

const key =
`${sender}_${clean}`;

/*
CREATE
*/
if (!tracker[key]) {

tracker[key] = {
groups: new Set(),
count: 0,
text
};

}

/*
NEW GROUP?
*/
if (
!tracker[key]
.groups.has(jid)
) {

tracker[key]
.groups.add(jid);

tracker[key]
.count++;

}

/*
POST DETECTED
*/
if (
tracker[key].count >= 3
) {

/*
ALREADY SENT?
*/
if (
sentPosts.has(key)
) {
return;
}

sentPosts.add(key);

/*
NUMBER
*/
const number =
extractNumber(sender);

/*
FINAL
*/
const final =
buildMessage(
number,
groupName,
text
);

/*
SEND
*/
await sock.sendMessage(
ADMIN_GROUP,
{
text: final
}
);

}

} catch (err) {

console.log(
"AUTO TRACK ERROR:",
err.message
);

}

}

module.exports = {
forwardWork,
autoScanWorkers
};
