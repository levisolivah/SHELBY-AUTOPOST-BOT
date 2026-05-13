const express = require("express");
const cors = require("cors");

const authRoutes =
require("./routes/authRoutes");

const userRoutes =
require("./routes/userRoutes");

const messageRoutes =
require("./routes/messageRoutes");

const groupRoutes =
require("./routes/groupRoutes");

const campaignRoutes =
require("./routes/campaignRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

  res.json({
    name: "SHELBY BACKEND",
    status: "running"
  });

});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/campaigns", campaignRoutes);

module.exports = app;
