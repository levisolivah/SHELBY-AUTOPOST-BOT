/*
SELF CONTAINED
MENU COMMAND
*/
module.exports = {

name: ".menu",

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
MENU
*/
const menu =
`
╔════════════════════╗
   🚀 SHELBY BOT MENU
╚════════════════════╝

🛡️ GROUP PROTECTION
├ .antilink on
└ .antilink off

📡 TRACKING
├ .links
└ .work

📢 CAMPAIGNS
└ .campaigns

⚙️ SYSTEM
├ .ping
└ .menu

════════════════════
SHELBY ALPHA ENGINE
════════════════════
`;

/*
SEND
*/
await sock.sendMessage(
jid,
{
text: menu
}
);

} catch (err) {

console.log(
"MENU ERROR:",
err.message
);

}

}

};
