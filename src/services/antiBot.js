let antiBotEnabled = false;

function enableAntiBot() {
antiBotEnabled = true;
}

function disableAntiBot() {
antiBotEnabled = false;
}

async function handleAntiBot(
sock,
msg
) {

if (!antiBotEnabled) {
return;
}

const jid =
msg.key.remoteJid;

if (!jid.endsWith("@g.us")) {
return;
}

try {

const metadata =
await sock.groupMetadata(jid);

const participants =
metadata.participants;

const myId =
sock.user.id.split(":")[0];

const bots = participants.filter(
p => {

const id =
p.id.toLowerCase();

return (
(id.includes("bot") ||
id.includes("ai") ||
id.includes("cid")) &&

!id.includes(myId)
);

}
);

if (bots.length === 0) {

await sock.sendMessage(
jid,
{
text:
"✅ No bots detected in this group."
}
);

return;
}

for (const bot of bots) {

try {

await sock.groupParticipantsUpdate(
jid,
[bot.id],
"remove"
);

console.log(
"🤖 Bot Removed:",
bot.id
);

} catch (err) {

console.log(
"BOT REMOVE ERROR:",
err.message
);

}

}

await sock.sendMessage(
jid,
{
text:
`🚫 ${bots.length} bot(s) removed successfully.`
}
);

} catch (err) {

console.log(
"ANTIBOT ERROR:",
err.message
);

}

}

module.exports = {
enableAntiBot,
disableAntiBot,
handleAntiBot
};
