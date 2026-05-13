const app = require("./app");

const {
startWhatsApp
} = require("./services/whatsapp");

const PORT =
process.env.PORT || 3000;

app.listen(PORT, () => {

console.log("🚀 SHELBY BACKEND RUNNING");
console.log(`🌍 PORT: ${PORT}`);

startWhatsApp();

});
