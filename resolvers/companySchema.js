const { ApolloError } = require("apollo-server");

const Company = require("../models/company");
const Employee = require("../models/employee");

const companyeResolvers = {
  Mutation: {
    async createCompany(
      _,
      { companyInput: { name, is_active, employeesId, email } },
      context
    ) {
      if (!context?.user || !context?.user._id) {
        return new ApolloError(
          "You don't have rights to add company",
          "LOGIN_REQUIRED"
        );
      }
      var data = {
        name,
        is_active,
        employeesId,
        email,
        createdBy: context?.user.name,
        createdAt: Date.now(),
      };
      console.log(context);
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
