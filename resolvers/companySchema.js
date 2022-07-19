const Company = require("../models/company");

const companyeResolvers = {
  Mutation: {
    async createCompany(_, { companyInput: { name, is_active, employeesId } }) {
      var data = {
        name,
        is_active,
        employeesId,
      };

      const newCompany = await new Company(data);
      newCompany.save();

      return {
        _id: newCompany._id,
        ...data,
      };
    },
    async deleteCompany(_, { _id }) {
      return Company.findByIdAndRemove({ _id });
    },
    async updateCompany(_, { _id, companyInput }) {
      const updatedCompany = await Company.findOneAndUpdate(
        { _id },
        companyInput,
        { new: true }
      );
      return updatedCompany;
    },
  },
  Query: {
    async getCompanies() {
      return Company.find({});
    },
    async getCompany(_, { _id }) {
      return Company.findById(_id);
    },
  },
};

module.exports = companyeResolvers;
