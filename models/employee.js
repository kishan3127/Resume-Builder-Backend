const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  name: String,
  skill_intro: String,
});

module.exports = mongoose.model("Employee", employeeSchema);
