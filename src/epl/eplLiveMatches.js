module.exports = async (
sock,
jid
) => {

await sock.sendMessage(
jid,
{
text:
`🔴 LIVE EPL MATCHES

⚽ Arsenal 2 - 1 Chelsea
⏱️ 78'

⚽ Liverpool 1 - 0 Spurs
⏱️ 55'

🤖 SHELBY ALPHA BOT`
}
);

};
