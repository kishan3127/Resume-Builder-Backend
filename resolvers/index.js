const Employee = require("../models/employee");
const Company = require("../models/company");

const resolvers = {
  Mutation: {
    async createEmployee(_, { employeeInput: { name, skill_intro } }) {
      var data = {
        name: name,
        skill_intro: skill_intro,
      };
      const newEmployee = new Employee(data);

      await newEmployee.save();

      return {
        ...data,
      };
    },
  },
  Query: {
    async getEmployees() {
      return Employee.find({});
    },
    async getCompanies() {
      return Company.find({});
    },
    async getEmployee(_,variable){
      console.log(_, variable.id);
      return Employee.findById(variable.id);
    },
  },
};

 
module.exports = resolvers;