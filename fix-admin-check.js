const fs = require("fs");

const file =
"./src/commands/internalpromo.js";

let code =
fs.readFileSync(
file,
"utf8"
);

/*
REPLACE OLD ADMIN CHECK
*/
code = code.replace(
/const botId[\s\S]*?!me\.admin\s*\)/,
`const me =
metadata.participants.find(
p =>
p.id.includes(
sock.user.id.split(":")[0]
)
);

if (
!me ||
(me.admin !== "admin" &&
me.admin !== "superadmin")
)`
);

fs.writeFileSync(
file,
code
);

console.log(
"✅ Admin check fixed."
);
