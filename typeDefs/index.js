const { gql } = require("apollo-server");

const typeDefs = gql`
  directive @auth(requires: Role = ADMIN) on OBJECT | FIELD_DEFINITION

  enum Role {
    ADMIN
    HR
    SALES
    USER
    COMPANY
  }

  type Employee @auth(requires: HR) {
    _id: ID!
    email: String
    name: String
    skill_intro: String
    token: String
    companies: [Company!]
    password: String
  }

  type Company {
    _id: ID!
    name: String!
    is_active: Boolean
    employeesId: [String]
    employees: [Employee!]
  }

  input EmployeeInput {
    name: String!
    email: String!
    skill_intro: String
    password: String!
  }
  input EmployeeLoginInput {
    email: String!
    password: String!
  }

  input CompanyInput {
    name: String!
    is_active: Boolean
    employeesId: [String]
  }

  type Query {
    getEmployees: [Employee!]
    getEmployee(_id: ID!): Employee!

    getCompanies: [Company!]
    getCompany(_id: ID!): Company!
  }

  type Mutation {
    createEmployee(employeeInput: EmployeeInput): Employee!
    loginEmployee(loginInput: EmployeeLoginInput): Employee!
    updateEmployee(_id: ID!, employeeInput: EmployeeInput): Employee!
    deleteEmployee(_id: ID): Employee

    createCompany(companyInput: CompanyInput): Company!
    updateCompany(_id: ID!, companyInput: CompanyInput): Company!

    deleteCompany(_id: ID): Company
  }
`;

module.exports = typeDefs;
