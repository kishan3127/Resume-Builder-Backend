const graphql = require("graphql");

const Employee = require("../models/employee");
const Company = require("../models/company");

const { create, append } = require("../helper/logger");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;

const EmployeeType = new GraphQLObjectType({
  name: "Employee",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    contact: { type: GraphQLString },
    skill_intro: { type: GraphQLString },
    companies: {
      type: new GraphQLList(CompanyType),
      resolve(parent, args) {
        // check the list of employess from the employees IDs
        return Company.find({ employeesId: parent.id });
      },
    },
  }),
});

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    is_active: { type: GraphQLBoolean },
    url: { type: GraphQLString },
    employeesId: { type: GraphQLList(GraphQLString) },
    employees: {
      type: new GraphQLList(EmployeeType),
      resolve(parent, args) {
        // check the list of employess from the employees IDs
        return Employee.find({ _id: { $in: parent.employeesId } });
      },
    },
    // educations: {type:GraphQLString},
    // projects: {type:GraphQLString},
    // skills: {type:GraphQLString}
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    employee: {
      type: EmployeeType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Employee.findById(args.id);
      },
    },
    company: {
      type: CompanyType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Company.findById(args.id);
      },
    },
    companies: {
      type: new GraphQLList(CompanyType),
      resolve(parent, args) {
        // return books
        return Company.find({});
      },
    },
    employees: {
      type: new GraphQLList(EmployeeType),
      resolve(parent, args) {
        return Employee.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    deleteEmployee: {
      type: EmployeeType,
      args: {
        employeeId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        const result = await Employee.deleteOne({
          _id: args.employeeId,
        });

        return result;
      },
    },
    addEmployee: {
      type: EmployeeType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        skill_intro: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parent, args) {
        let employee = new Employee({
          name: args.name,
          skill_intro: args.skill_intro,
        });
        create("Create.txt", "Saved");
        return employee.save();
      },
    },
    addCompany: {
      type: CompanyType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        is_active: {
          type: new GraphQLNonNull(GraphQLBoolean),
        },
        employeesId: {
          type: new GraphQLList(GraphQLID),
        },
      },
      resolve(parent, args) {
        let company = new Company({
          name: args.name,
          is_active: args.is_active,
          employeesId: args.employeesId,
        });
        return company.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
