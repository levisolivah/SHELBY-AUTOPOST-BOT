const fs =
require("fs");

/*
DATABASE FILE
*/
const SAVE_FILE =
"./database/groupLinks.json";

/*
OWNER
*/
const OWNER_JID =
"254783478624@s.whatsapp.net";

/*
MEMORY
*/
let savedLinks = [];

/*
LOAD DATABASE
*/
try {

if (
fs.existsSync(SAVE_FILE)
) {

savedLinks =
JSON.parse(
fs.readFileSync(
SAVE_FILE,
"utf8"
)
);

}

} catch {

savedLinks = [];

}

/*
CREATE DATABASE
*/
if (
!fs.existsSync("./database")
) {

fs.mkdirSync(
"./database"
);

}

if (
!fs.existsSync(SAVE_FILE)
) {

fs.writeFileSync(
SAVE_FILE,
"[]"
);

}

/*
SAVE DATABASE
*/
function saveDatabase() {

fs.writeFileSync(
SAVE_FILE,
JSON.stringify(
savedLinks,
null,
2
)
);

}

/*
CLEAR DATABASE
*/
function clearDatabase() {

savedLinks = [];

saveDatabase();

}

/*
EXTRACT LINKS
*/
function extractLinks(text) {

const regex =
/https?:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+|chat\.whatsapp\.com\/[A-Za-z0-9]+/gi;

const matches =
text.match(regex) || [];

return [
...new Set(

matches.map(link => {

if (
!link.startsWith("http")
) {

return `https://${link}`;

}

return link;

})

)

];

}

/*
COMMAND
*/
module.exports = {

name: ".links",

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
SHOW LINKS
*/
if (
text.trim().toLowerCase()
=== ".links"
) {

if (
savedLinks.length === 0
) {

await sock.sendMessage(
jid,
{
text:
"❌ No saved links yet."
}
);

return;

}

let output =
`📡 *SAVED GROUP LINKS*

TOTAL:
${savedLinks.length}

\n`;

savedLinks
.slice()
.reverse()
.forEach(
(item, i) => {

output +=
`${i + 1}.\n` +
`👥 ${item.group}\n` +
`👤 ${item.sender}\n` +
`🔗 ${item.link}\n\n`;

}
);

await sock.sendMessage(
jid,
{
text: output
}
);

/*
CLEAR AFTER VIEW
*/
clearDatabase();

return;

}

/*
BACKGROUND TRACKER
*/
const fullText =
JSON.stringify(
msg.message || {}
);

const links =
extractLinks(fullText);

if (
links.length === 0
) {
return;
}

/*
GROUP ONLY
*/
if (
!jid.endsWith("@g.us")
) {
return;
}

/*
IGNORE BOT
*/
if (
msg.key.fromMe
) {
return;
}

/*
GROUP INFO
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
SENDER
*/
const sender =
msg.key.participant ||
"unknown";

/*
PROCESS
*/
let newSaved = 0;

for (const link of links) {

/*
DUPLICATE
*/
const exists =
savedLinks.find(
x =>
x.link === link
);

if (exists) {
continue;
}

/*
SAVE
*/
savedLinks.push({
group: groupName,
sender,
link,
time:
new Date()
.toISOString()
});

newSaved++;

}

/*
SAVE + NOTIFY
*/
if (
newSaved > 0
) {

saveDatabase();

/*
NOTIFY OWNER
*/
await sock.sendMessage(
OWNER_JID,
{
text:
`📡 One more group added to your collection.

📦 Saved Groups:
${savedLinks.length}

Type *.links* to view.`
}
);

}

} catch (err) {

console.log(
"LINKS ERROR:",
err.message
);

}

}

};
