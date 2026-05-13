/*
SELF CONTAINED
GROUP ID COMMAND
*/
module.exports = {

name: ".groupid",

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
FETCH GROUP INFO
*/
let groupName =
"Unknown Group";

try {

const metadata =
await sock.groupMetadata(
jid
);

groupName =
metadata.subject;

} catch {}

/*
MESSAGE
*/
const response =
`📡 GROUP INFORMATION

👥 Name:
${groupName}

🆔 Group ID:
${jid}`;

/*
SEND
*/
await sock.sendMessage(
jid,
{
text: response
}
);

} catch (err) {

console.log(
"GROUPID ERROR:",
err.message
);

}

}

};
