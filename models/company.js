const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = new Schema({
  name: {
    type: String,
    default: null,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
  employeesId: {
    type: Array,
    default: [],
  },
  email: {
    type: String,
    default: null,
  },
  createdAt: {
    type: String,
    default: null,
  },
  createdBy: {
    type: String,
    default: "Admin",
  },
});

module.exports = mongoose.model("Company", companySchema);
