const fs = require("fs");
const path = require("path");

/*
COMMANDS PATH
*/
const commandsPath =
path.join(
__dirname,
"../commands"
);

/*
COMMANDS STORAGE
*/
const commands = {};

/*
LOAD COMMAND FILES
*/
const files =
fs.readdirSync(
commandsPath
).filter(
file =>
file.endsWith(".js")
);

/*
REGISTER COMMANDS
*/
for (const file of files) {

try {

const command =
require(
path.join(
commandsPath,
file
)
);

if (
command &&
command.name
) {

commands[
command.name
] = command;

console.log(
"✅ Loaded:",
command.name
);

}

} catch (err) {

console.log(
"❌ Failed:",
file,
err.message
);

}

}

/*
HANDLE COMMANDS
*/
async function handleCommand(
sock,
msg
) {

try {

/*
READ MESSAGE TEXT
*/
const text =
msg.message?.conversation ||

msg.message?.extendedTextMessage?.text ||

msg.message?.imageMessage?.caption ||

msg.message?.videoMessage?.caption ||

msg.message?.documentMessage?.caption ||

"";

/*
NO TEXT
*/
if (!text) {
return;
}

/*
COMMANDS ONLY
*/
if (
text.startsWith(".")
) {

const args =
text.trim().split(/\s+/);

const commandName =
args[0]
.toLowerCase();

/*
FIND COMMAND
*/
const command =
commands[
commandName
];

if (!command) {
return;
}

/*
EXECUTE COMMAND
*/
await command.execute(
sock,
msg,
args,
text
);

return;

}

/*
ONLY INTERNAL PROMO
WAITING STATE
*/
try {

const state =
require(
"../campaigns/internalPromoState"
);

/*
WAITING?
*/
if (
state.waiting[
msg.key.remoteJid
]
) {

const internalPromo =
commands[
".internal"
];

if (
internalPromo
) {

await internalPromo.execute(
sock,
msg,
[],
text
);

}

}

} catch (err) {

console.log(
"WAITING STATE ERROR:",
err.message
);

}

} catch (err) {

console.log(
"HANDLER ERROR:",
err.message
);

}

}

module.exports = {
handleCommand
};
