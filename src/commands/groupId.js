module.exports = async (
sock,
msg
) => {

const jid =
msg.key.remoteJid;

/*
ONLY GROUPS
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
SEND GROUP UID
*/
await sock.sendMessage(
jid,
{
text:
`🆔 GROUP UID

${jid}`
}
);

};
