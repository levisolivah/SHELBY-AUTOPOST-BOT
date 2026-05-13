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
browser: ["Shelby", "Chrome", "1.0.0"]
});

sock.ev.on("creds.update", saveCreds);

sock.ev.on(
"connection.update",
async ({ connection, lastDisconnect }) => {

if (!state.creds.registered) {

try {

const phoneNumber = "254756275893";

const code =
await sock.requestPairingCode(phoneNumber);

console.log("PAIRING CODE:", code);

} catch (err) {

console.log(
"PAIRING ERROR:",
err.message
);

}

}

if (connection === "open") {

console.log("✅ WHATSAPP CONNECTED");

}

if (connection === "close") {

const statusCode =
new Boom(lastDisconnect?.error)
?.output?.statusCode;

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
}, 5000);

}

}

}
);

return sock;

}

module.exports = {
startWhatsApp
};
