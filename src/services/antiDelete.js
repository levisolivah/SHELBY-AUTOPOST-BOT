let antiDeleteEnabled = false;

const deletedMessages = new Map();

function enableAntiDelete() {
    antiDeleteEnabled = true;
}

function disableAntiDelete() {
    antiDeleteEnabled = false;
}

function isAntiDeleteEnabled() {
    return antiDeleteEnabled;
}

function saveMessage(message) {

    if (!message.key?.id) return;

    deletedMessages.set(
        message.key.id,
        {
            text:
                message.message?.conversation ||

                message.message?.extendedTextMessage?.text ||

                "",

            sender:
                message.pushName || "Unknown",

            jid:
                message.key.remoteJid
        }
    );
}

async function handleDeletedMessage(
    sock,
    protocolMessage,
    ownerJid
) {

    if (!antiDeleteEnabled) return;

    const deletedKey =
        protocolMessage.key;

    const saved =
        deletedMessages.get(
            deletedKey.id
        );

    if (!saved) return;

    const report = `
🚨 SHELBY ALPHA BOT
🗑️ DELETED MESSAGE DETECTED

👤 Sender:
${saved.sender}

📍 Chat:
${saved.jid}

💬 Message:
${saved.text}

━━━━━━━━━━━━━━━━━━
⚠️ Anti Delete Recovery
━━━━━━━━━━━━━━━━━━
`;

    await sock.sendMessage(
        ownerJid,
        {
            text: report
        }
    );
}

module.exports = {
    enableAntiDelete,
    disableAntiDelete,
    isAntiDeleteEnabled,
    saveMessage,
    handleDeletedMessage
};
