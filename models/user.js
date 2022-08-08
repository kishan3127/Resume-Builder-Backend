const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  name: String,
  password: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["ADMIN", "HR", "SUPERADMIN", "SALES", "USER", "COMPANY"],
    default: "USER",
  },
});

module.exports = mongoose.model("User", userSchema);
