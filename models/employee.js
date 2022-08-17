const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  email: {
    type: String,
    default: null,
  },
  userImage: {
    type: String,
    default: null,
  },
  department: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    default: null,
  },
  skill_intro: {
    type: String,
    default: null,
  },
  contact: {
    type: String,
    default: null,
  },
  intro: {
    title: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
  },
  projects: [
    {
      role: {
        type: String,
        default: null,
      },
      description: {
        type: String,
        default: null,
      },
    },
  ],
  educations: [
    {
      course: {
        type: String,
        default: null,
      },
      description: {
        type: String,
        default: null,
      },
    },
  ],
  skills: [
    {
      name: {
        type: String,
        default: null,
      },
      percentage: {
        type: Number,
        default: 0,
      },
      show: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model("Employee", employeeSchema);
