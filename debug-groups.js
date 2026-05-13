const fs = require("fs");

/*
LOAD GROUP IDS
*/
const groups =
JSON.parse(
fs.readFileSync(
"./database/internalGroups.json",
"utf8"
)
);

console.log(
"📡 TOTAL GROUPS:",
groups.length
);

for (const id of groups) {

console.log(
"GROUP ID:",
id
);

}
