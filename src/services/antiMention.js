const activeAntiMention = new Set();

function enableAntiMention(groupId) {
    activeAntiMention.add(groupId);
}

function disableAntiMention(groupId) {
    activeAntiMention.delete(groupId);
}

function isAntiMentionEnabled(groupId) {
    return activeAntiMention.has(groupId);
}

async function handleAntiMention(sock, message) {

    try {

        const jid = message.key.remoteJid;

        // groups only
        if (!jid.endsWith("@g.us")) {
            return;
        }

        // feature disabled
        if (!isAntiMentionEnabled(jid)) {
            return;
        }

        const text =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            "";

        if (!text) {
            return;
        }

        /*
        DETECT:
        "your group was mentioned"
        */

        const lower =
            text.toLowerCase();

        if (
            !lower.includes(
                "your group was mentioned"
            )
        ) {
            return;
        }

        // delete notification
        await sock.sendMessage(jid, {
            delete: message.key
        });

        // warn
        await sock.sendMessage(jid, {
            text:
`🚫 Group status mentions are not allowed.

Please avoid mentioning this group in statuses.`
        });

        console.log(
            "ANTI-MENTION TRIGGERED"
        );

    } catch (err) {

        console.log(
            "ANTI-MENTION ERROR:",
            err.message
        );

    }

}

module.exports = {
    enableAntiMention,
    disableAntiMention,
    handleAntiMention
};
