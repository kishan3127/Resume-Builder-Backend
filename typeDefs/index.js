const { gql } = require("apollo-server");

const typeDefs = gql`

  type Employee {
    _id: ID!
    name: String
    skill_intro: String
    companies:[Company!]
  }

  type Company {
    _id: ID!
    name: String!
    is_active: Boolean
    employeesId: [String]
    employees:[Employee!]
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
    getEmployee(_id:ID!): Employee!
    companies:Company!

    getCompanies: [Company!]
    getCompany(_id:ID!): Company!
  
  }
  type Mutation {
    createEmployee(employeeInput: EmployeeInput): Employee!
    updateEmployee(_id:ID!,employeeInput: EmployeeInput): Employee!
    deleteEmployee(_id: ID): Employee

    createCompany(companyInput: CompanyInput): Company!
    updateCompany(_id:ID!,companyInput: CompanyInput): Company!

    deleteCompany(_id: ID): Company
  }
`;

module.exports = typeDefs;
