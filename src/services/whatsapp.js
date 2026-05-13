const {
default: makeWASocket,
useMultiFileAuthState,
fetchLatestBaileysVersion,
DisconnectReason
} = require("@whiskeysockets/baileys");

const P = require("pino");
const { Boom } = require("@hapi/boom");

async function startWhatsApp() {

const { state, saveCreds } =
await useMultiFileAuthState("./session");

const { version } =
await fetchLatestBaileysVersion();

const sock = makeWASocket({
version,
logger: P({ level: "silent" }),
printQRInTerminal: false,
auth: state,
browser: ["Ubuntu", "Chrome", "20.0.04"]
});

sock.ev.on("creds.update", saveCreds);

let pairingRequested = false;

sock.ev.on(
"connection.update",
async ({
connection,
lastDisconnect
}) => {

try {

if (
connection === "open"
) {

console.log(
"✅ WhatsApp Connected"
);

}

if (
connection === "close"
) {

const statusCode =
new Boom(
lastDisconnect?.error
)?.output?.statusCode;

console.log(
"❌ Connection closed:",
statusCode
);

if (
statusCode !==
DisconnectReason.loggedOut
) {

setTimeout(() => {
startWhatsApp();
}, 10000);

}

}

if (
!pairingRequested &&
!state.creds.registered
) {

pairingRequested = true;

const code =
await sock.requestPairingCode(
"254756275893"
);

console.log(
"PAIRING CODE:",
code
);

}

} catch (err) {

console.log(
"PAIRING ERROR:",
err.message
);

}

}
);

return sock;

}

module.exports = {
startWhatsApp
};
