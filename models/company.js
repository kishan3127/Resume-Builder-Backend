const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = new Schema({
  name: String,
  is_active: Boolean,
  employeesId: [],
});

module.exports = mongoose.model("Company", companySchema);
