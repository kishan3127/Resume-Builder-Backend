const { gql } = require("apollo-server");

const typeDefs = gql`
  directive @isAuth on OBJECT | FIELD_DEFINITION
  directive @upper on OBJECT | FIELD_DEFINITION

  enum Role {
    SUPERADMIN
    ADMIN
    HR
    SALES
    USER
    COMPANY
  }

  type Intro {
    description: String
    title: String
  }

  type Project {
    role: String
    description: String
  }

  type Education {
    course: String
    description: String
  }

  type Skill {
    name: String
    percentage: Int
    show: Boolean
  }

  input IntroInput {
    description: String
    title: String
  }

  input ProjectInput {
    role: String
    description: String
  }

  input EducationInput {
    course: String
    description: String
  }

  input SkillInput {
    name: String
    percentage: Int
    show: Boolean
  }

  type User {
    _id: ID!
    name: String
    password: String
    email: String
    role: Role
    token: String
    expiresIn: Int
  }

  type Employee @isAuth {
    _id: ID!
    email: String
    name: String
    skill_intro: String
    companies: [Company!]

    contact: String
    intro: Intro
    projects: [Project]
    educations: [Education]
    skills: [Skill]
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

    contact: String
    intro: IntroInput
    projects: [ProjectInput]
    educations: [EducationInput]
    skills: [SkillInput]
  }

  input EmployeeInputEdit {
    name: String!
    email: String!
    skill_intro: String

    contact: String
    intro: IntroInput
    projects: [ProjectInput]
    educations: [EducationInput]
    skills: [SkillInput]
  }

  input EmployeeLoginInput {
    email: String!
    password: String!
  }

  input UserCreateInput {
    email: String!
    password: String!
    name: String!
    role: String!
  }

  input UserLoginInput {
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

    getCompanies: [Company!] @isAuth
    getCompany(_id: ID!): Company!
    getUser(_id: ID!): User
    getUsers: [User]
  }

  type Mutation {
    loginEmployee(loginInput: EmployeeLoginInput): Employee!
    loginUser(loginInput: UserLoginInput): User!

    createUser(userCreateInput: UserCreateInput): User!

    createEmployee(employeeInput: EmployeeInput): Employee @isAuth
    updateEmployee(_id: ID!, employeeInput: EmployeeInputEdit): Employee!
      @isAuth

    deleteEmployee(_id: ID): Employee @isAuth

    createCompany(companyInput: CompanyInput): Company! @isAuth
    updateCompany(_id: ID!, companyInput: CompanyInput): Company! @isAuth

    deleteCompany(_id: ID): Company @isAuth
  }
`;

module.exports = typeDefs;
