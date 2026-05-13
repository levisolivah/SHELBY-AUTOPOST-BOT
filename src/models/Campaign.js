const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  delay: {
    type: Number,
    default: 60
  },

  groups: {
    type: Array,
    default: []
  },

  active: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports =
mongoose.model(
  "Campaign",
  campaignSchema
);
