const fs = require("fs");

const SAVE_FILE =
"./database/groupLinks.json";

const OWNER_JID =
"254783478624@s.whatsapp.net";

/*
ACTIVE MEMORY CACHE
*/
let savedLinks = [];

/*
LOAD EXISTING
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
EXTRACT TEXT
*/
function extractText(msg) {

try {

return JSON.stringify(
msg.message || {}
);

} catch {

return "";

}

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
TRACK LINKS
*/
async function trackGroupLinks(
sock,
msg
) {

try {

const jid =
msg.key.remoteJid;

/*
GROUP ONLY
*/
if (
!jid ||
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
FULL TEXT
*/
const fullText =
extractText(msg);

if (!fullText) {
return;
}

/*
EXTRACT LINKS
*/
const links =
extractLinks(fullText);

if (
links.length === 0
) {
return;
}

/*
GROUP NAME
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
NEW COUNT
*/
let newSaved = 0;

/*
PROCESS
*/
for (const link of links) {

/*
DUPLICATE CHECK
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

console.log(
"NEW LINK:",
link
);

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
"TRACK ERROR:",
err.message
);

}

}

/*
SHOW LINKS
*/
async function showSavedLinks(
sock,
jid
) {

try {

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

let text =
`📡 *SAVED GROUP LINKS*

TOTAL:
${savedLinks.length}

\n`;

savedLinks
.slice()
.reverse()
.forEach(
(item, i) => {

text +=
`${i + 1}.\n` +
`👥 ${item.group}\n` +
`👤 ${item.sender}\n` +
`🔗 ${item.link}\n\n`;

}
);

await sock.sendMessage(
jid,
{
text
}
);

/*
CLEAR AFTER VIEW
*/
clearDatabase();

console.log(
"GROUP LINKS CLEARED"
);

} catch (err) {

console.log(
"SHOW ERROR:",
err.message
);

}

}

module.exports = {
trackGroupLinks,
showSavedLinks
};
