const axios = require("axios");

module.exports = async (
sock,
jid
) => {

try {

await sock.sendMessage(
jid,
{
text:
"⏳ Fetching LIVE EPL table..."
}
);

/*
FETCH REAL TABLE
*/
const response =
await axios.get(
"https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4328&s=2025-2026"
);

const tableData =
response.data.table;

if (
!tableData ||
tableData.length === 0
) {

await sock.sendMessage(
jid,
{
text:
"❌ EPL table unavailable."
}
);

return;
}

/*
BUILD PROFESSIONAL TABLE
*/
let table =
`🏆 LIVE EPL TABLE
━━━━━━━━━━━━━━━━━━━━

`;

tableData
.slice(0, 20)
.forEach(
(team, index) => {

const name =
(team.strTeam || "Unknown")
.substring(0, 15);

const pts =
team.intPoints || 0;

const played =
team.intPlayed || 0;

table +=
`${String(index + 1).padEnd(2)} ${name.padEnd(16)} ${String(pts).padEnd(3)}pts ${played}P
`;

}
);

table +=
`\n━━━━━━━━━━━━━━━━━━━━
🤖 SHELBY ALPHA BOT`;

/*
SEND AS MONOSPACE
*/
await sock.sendMessage(
jid,
{
text:
"```" + table + "```"
}
);

} catch (err) {

console.log(
"EPL TABLE ERROR:",
err.message
);

await sock.sendMessage(
jid,
{
text:
"❌ Failed to fetch live EPL table."
}
);

}

};
