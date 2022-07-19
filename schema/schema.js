const graphql = require("graphql");

const { append } = require("../helper/logger");
const { Company, Employee } = require("../models");
const {createLogFile} = require("../helper/fileNameCreator")
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;


const formatDate = () => {
  const date = new Date();
  return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
};

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
        return Employee.find({ employeesId: parent.id });
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
        const result = await Employee.findByIdAndRemove({
          _id: args.employeeId,
        }).catch((error) => {
          // TODO: Create a new function for logs file creation
          append(
            createLogFile("delete"),
            "\n" + new Date() + " " + error + " - deleteEmployee"
          );
          return error;
        });

        return result || new Error("User Doesn't exists");
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
        return employee.save().catch((err) => {
          append(
            formatDate() + "_createEmployee.txt",
            "\n" + new Date() + " " + err + " - addEmployee"
          );
        });
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
        return company.save().catch((err) => {
          append(
            formatDate() + "_createCompany.txt",
            "\n" + new Date() + " " + err + " - addCompany"
          );
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

