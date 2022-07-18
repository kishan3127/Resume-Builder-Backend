const company = require("../models/company");
const Employee = require("../models/employee");

const employeeResolvers = {
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

    async deleteEmployee(_, { _id }) {      
        return  Employee.findByIdAndRemove({_id})
    },
    
    async updateEmployee(_, {_id,employeeInput}) { 
      const updatedUser = await Employee.findOneAndUpdate({_id},employeeInput,{new:true})
      return updatedUser;    
    },

   },
  Query: {
    
    async getEmployees() {
      return Employee.find({});
    },

    async getEmployee(parent,{_id}){
      return Employee.findById(_id);
    }
  }
};

 
module.exports = employeeResolvers;