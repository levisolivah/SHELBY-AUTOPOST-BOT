module.exports = {

name: ".kick",

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

/*
GET GROUP DATA
*/
const metadata =
await sock.groupMetadata(
jid
);

/*
BOT ID
*/
const botId =
sock.user.id
.split(":")[0] +
"@s.whatsapp.net";

/*
BOT ADMIN?
*/
const me =
metadata.participants.find(
p =>
p.id.includes(
sock.user.id.split(":")[0]
)
);

if (
!me ||
(me.admin !== "admin" &&
me.admin !== "superadmin")
) {

await sock.sendMessage(
jid,
{
text:
"❌ Bot is not admin."
}
);

return;

}

/*
TARGET
*/
let target = null;

/*
MENTION METHOD
*/
const mentioned =
msg.message?.extendedTextMessage
?.contextInfo
?.mentionedJid;

if (
mentioned &&
mentioned.length > 0
) {

target =
mentioned[0];

}

/*
REPLY METHOD
*/
if (!target) {

const quoted =
msg.message?.extendedTextMessage
?.contextInfo
?.participant;

if (quoted) {

target = quoted;

}

}

/*
NO TARGET
*/
if (!target) {

await sock.sendMessage(
jid,
{
text:
"❌ Tag or reply to a member."
}
);

return;

}

/*
TARGET ADMIN?
*/
const victim =
metadata.participants.find(
p =>
p.id === target
);

if (
victim &&
(victim.admin === "admin" ||
victim.admin === "superadmin")
) {

await sock.sendMessage(
jid,
{
text:
"❌ Cannot remove an admin."
}
);

return;

}

/*
WARNING
*/
await sock.sendMessage(
jid,
{
text:
`⚖️ @${target.split("@")[0]}

You are banned for
2 million years.

Case closed.`,
mentions: [target]
}
);

/*
WAIT
*/
await new Promise(
resolve =>
setTimeout(
resolve,
2000
)
);

/*
REMOVE
*/
await sock.groupParticipantsUpdate(
jid,
[target],
"remove"
);

console.log(
"KICKED:",
target
);

} catch (err) {

console.log(
"KICK ERROR:",
err.message
);

}

}

};
