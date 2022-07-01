const { gql } = require("apollo-server");

const typeDefs = gql`
  type Employee {
    "A simple type for getting started!"
    id: ID!
    name: String
    skill_intro: String
  }

  type Company {
    "A simple type for getting started!"
    id: ID!
    name: String!
    is_active: Boolean
    employeesId: [String]
  }

  input EmployeeInput {
    name: String!
    skill_intro: String!
  }

  input CompanyInput {
    name: String!
    is_active: Boolean
    employeesId: [String]
  }

  type Query {
    getEmployees: [Employee!]
    getCompanies: [Company!]
    getEmployee(id:ID!): Employee!
  }
  type Mutation {
    createEmployee(employeeInput: EmployeeInput): Employee!
    createCompany(companyInput: CompanyInput): Company!
  }
`;

module.exports = typeDefs;
