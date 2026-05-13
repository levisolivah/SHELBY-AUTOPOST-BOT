module.exports = async (
sock,
jid
) => {

await sock.sendMessage(
jid,
{
text:
`📅 EPL FIXTURES

⚽ Saturday
Arsenal vs Chelsea

⚽ Sunday
Liverpool vs Spurs

⚽ Monday
Manchester United vs Aston Villa

🤖 SHELBY ALPHA BOT`
}
);

};
