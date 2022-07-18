const Company = require("../models/company");
const Employee = require("../models/employee");

const companyeResolvers = {
  Mutation: {
    async createCompany(_, { companyInput: { name, is_active,employeesId } }) {

      var data = {
        name: name,
        is_active: is_active,
        employeesId:employeesId
      };

      const newCompany = new Company(data);
      await newCompany.save();

      return {
        id:newCompany._id,
        ...data,
      };

    },
    async deleteCompany(_, { id }) {
      return  Company.findByIdAndRemove({_id: id})
    },
    async updateCompany(_, {_id,companyInput}) {
      const updatedCompany = await Company.findOneAndUpdate({_id},companyInput,{new:true})
      return updatedCompany
    },   
  },
  Query: {
    async getCompanies(parent) {
      return Company.find({});
    },
    async getCompany(parent,{_id}) {
      return Company.findById(_id);
    }
  },
};

 
module.exports = companyeResolvers;