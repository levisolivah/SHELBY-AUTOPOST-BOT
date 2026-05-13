let antiLinkEnabled = false;

function enableAntiLink() {
antiLinkEnabled = true;
}

function disableAntiLink() {
antiLinkEnabled = false;
}

async function handleAntiLink(
sock,
msg
) {

if (!antiLinkEnabled) {
return;
}

const jid =
msg.key.remoteJid;

if (!jid.endsWith("@g.us")) {
return;
}

const sender =
msg.key.participant ||
msg.key.remoteJid;

const fromMe =
msg.key.fromMe;

if (fromMe) {
return;
}

const text =
msg.message?.conversation ||
msg.message?.extendedTextMessage?.text ||
msg.message?.imageMessage?.caption ||
msg.message?.videoMessage?.caption ||
"";

if (!text) {
return;
}

const linkPatterns = [

/chat\.whatsapp\.com/i,
/wa\.me/i,
/https?:\/\//i,
/www\./i,
/t\.me/i,
/discord\.gg/i

];

const hasLink =
linkPatterns.some(
pattern =>
pattern.test(text)
);

if (!hasLink) {
return;
}

try {

await sock.sendMessage(
jid,
{
delete: msg.key
}
);

await sock.sendMessage(
jid,
{
text:
`🚫 LINK DETECTED

👤 @${sender.split("@")[0]}

Links are not allowed in this group.`,
mentions: [sender]
}
);

console.log(
"🚫 Link Deleted"
);

} catch (err) {

console.log(
"ANTILINK ERROR:",
err.message
);

}

}

module.exports = {
enableAntiLink,
disableAntiLink,
handleAntiLink
};
