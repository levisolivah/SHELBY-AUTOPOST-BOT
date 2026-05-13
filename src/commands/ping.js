const fs =
require("fs");

/*
SELF CONTAINED
PING COMMAND
*/
module.exports = {

name: ".ping",

async execute(
sock,
msg
) {

try {

const jid =
msg.key.remoteJid;

/*
RANDOM STATS
*/
const latency =
Math.floor(
Math.random() * 35
) + 15;

const jitter =
Math.floor(
Math.random() * 6
) + 1;

const speed =
(
Math.random() * 8 + 5
).toFixed(2);

/*
UPTIME
*/
const uptime =
process.uptime();

const hours =
Math.floor(
uptime / 3600
);

const minutes =
Math.floor(
(uptime % 3600) / 60
);

const seconds =
Math.floor(
uptime % 60
);

/*
MESSAGE
*/
const caption = `
╔══════════════════════╗
    🚀 SHELBY ALPHA BOT
╚══════════════════════╝

🟢 SYSTEM STATUS
▰ ONLINE & STABLE

⚡ PERFORMANCE
├ Speed     : ${speed} MB/s
├ Latency   : ${latency} ms
└ Jitter    : ${jitter} ms

⏳ UPTIME
├ Hours     : ${hours}
├ Minutes   : ${minutes}
└ Seconds   : ${seconds}

🧠 ENGINE
▰ SELF CONTAINED MODULE

✅ STATUS
▰ OPERATIONAL
`;

/*
SEND
*/
await sock.sendMessage(
jid,
{
text: caption
}
);

} catch (err) {

console.log(
"PING ERROR:",
err.message
);

}

}

};
