const Employee = require("./employeeSchema");
const Company = require("./companySchema");
const User = require("./userSchema");

const CompanyModal = require("../models/company");
const EmployeeModal = require("../models/employee");

const resolvers = {
  Employee: {
    async companies(parent) {
      const data = await CompanyModal.find({ employeesId: parent.id });
      return data;
    },
  },

  Company: {
    async employees(parent) {
      const data = await EmployeeModal.find({
        _id: { $in: parent.employeesId },
      });
      return data;
    },
  },

  Mutation: {
    ...Employee.Mutation,
    ...Company.Mutation,
    ...User.Mutation,
  },
  Query: {
    ...Employee.Query,
    ...Company.Query,
    ...User.Query,
  },
};

module.exports = resolvers;
