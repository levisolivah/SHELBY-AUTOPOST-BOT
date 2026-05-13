module.exports = async (
sock,
jid
) => {

await sock.sendMessage(
jid,
{
text:
`⚽ EPL MATCHES TODAY

🕒 Arsenal vs Chelsea
🕒 Liverpool vs Spurs
🕒 Manchester United vs Aston Villa

🤖 SHELBY ALPHA BOT`
}
);

};
