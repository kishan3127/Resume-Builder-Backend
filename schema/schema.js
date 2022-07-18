const graphql = require("graphql");
cconst _ = require("loadsh");

const Book = require("../models/book");
const Author = require("../models/author");
const Employee = require("../models/employee");
const Company = require("../models/company");

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

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId);
      },
    },
  }),
});

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

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return _.filter(books,{authorId:parent.id})
        return Book.find({ authorId: parent.id });
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
        // return books
        return Company.find({});
      },
    },
    employees: {
      type: new GraphQLList(EmployeeType),
      resolve(parent, args) {
        // return books
        return Employee.find({});
      },
    },
    book: {
      type: BookType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        // return _.find(books,{id:args.id})
        return Book.findById(args.id);
      },
    },
    author: {
      type: AuthorType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Author.findById(args.id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books
        return Book.find({});
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
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
        const result = await Employee.findByIdandDelete({
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
    addAuthor: {
      type: AuthorType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        age: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        genre: {
          type: new GraphQLNonNull(GraphQLString),
        },
        authorId: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        return book.save();
