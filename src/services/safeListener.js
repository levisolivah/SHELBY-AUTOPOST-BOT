const safeMode =
require("../commands/safemode");

module.exports =
async function (
sock,
msg
) {

try {

if (
safeMode &&
safeMode.autoProtect
) {

await safeMode.autoProtect(
sock,
msg
);

}

} catch (err) {

console.log(
"SAFE LISTENER ERROR:",
err.message
);

}

};
