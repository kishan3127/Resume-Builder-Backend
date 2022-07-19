const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  email: String,
  name: String,
  skill_intro: String,
  password: String,
});

module.exports = mongoose.model("Employee", employeeSchema);
