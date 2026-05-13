const {
default: makeWASocket,
useMultiFileAuthState,
fetchLatestBaileysVersion,
DisconnectReason
} = require("@whiskeysockets/baileys");

const P = require("pino");

const {
Boom
} = require("@hapi/boom");

const {
handleCommand
} = require("./commandHandler");

const safeListener =
require("./safeListener");

/*
START WHATSAPP
*/
async function startWhatsApp() {

const {
state,
saveCreds
} =
await useMultiFileAuthState(
"./session"
);

/*
LATEST VERSION
*/
const {
version
} =
await fetchLatestBaileysVersion();

/*
SOCKET
*/
const sock =
makeWASocket({

version,

logger:
P({
level: "silent"
}),

printQRInTerminal: false,

auth: state,

browser: [
"Shelby",
"Chrome",
"1.0.0"
]

});

/*
SAVE CREDS
*/
sock.ev.on(
"creds.update",
saveCreds
);

/*
MESSAGES
*/
sock.ev.on(
"messages.upsert",
async ({
messages
}) => {

try {

const msg =
messages[0];

if (!msg) {
return;
}

if (
msg.key.remoteJid ===
"status@broadcast"
) {
return;
}

/*
COMMANDS
*/
await handleCommand(
sock,
msg
);

/*
SAFE MODE
*/
await safeListener(
sock,
msg
);

} catch (err) {

console.log(
"MESSAGE ERROR:",
err.message
);

}

}
);

/*
CONNECTION
*/
sock.ev.on(
"connection.update",
async ({
connection,
lastDisconnect
}) => {

/*
PAIRING CODE
*/
if (
connection === "connecting"
&& !state.creds.registered
) {

try {

const phoneNumber =
"254756275893";

const code =
await sock.requestPairingCode(
phoneNumber
);

console.log(
"PAIRING CODE:",
code
);

} catch (err) {

console.log(
"PAIRING ERROR:",
err.message
);

}

}

/*
CONNECTED
*/
if (
connection === "open"
) {

console.log(
"✅ WhatsApp Connected"
);

}

/*
DISCONNECTED
*/
if (
connection === "close"
) {

const statusCode =
new Boom(
lastDisconnect?.error
)?.output
?.statusCode;

console.log(
"❌ Connection closed:",
statusCode
);

if (
statusCode !==
DisconnectReason.loggedOut
) {

setTimeout(
() => {
startWhatsApp();
},
5000
);

}

}

});

return sock;

}

module.exports = {
startWhatsApp
};
