module.exports = async (
sock,
jid
) => {

await sock.sendMessage(
jid,
{
text:
`📰 EPL NEWS TODAY

⚡ Arsenal preparing major signing
⚡ Liverpool injury updates
⚡ Manchester United latest news
⚡ Chelsea transfer discussions

🤖 SHELBY ALPHA BOT`
}
);

};
