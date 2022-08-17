const { ApolloError } = require("apollo-server");

const Employee = require("../models/employee");
const Company = require("../models/company");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function deleteEmployeeIdFromCompany(_id) {
  Company.find({ employeesId: { $in: [_id] } }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      docs.map(async (doc) => {
        indexOfCandidate = doc.employeesId.indexOf(_id.toString());
        if (indexOfCandidate !== -1) {
          doc.employeesId.splice(indexOfCandidate, 1);
          const { _id: company_id, ...restCompanyDetails } = doc;
          await Company.findOneAndUpdate(
            { _id: company_id },
            restCompanyDetails,
            { new: true }
          ).exec();
        }
      });
    }
  });
}

const employeeResolvers = {
  Mutation: {
    async loginEmployee(_, { loginInput: { email, password } }, context) {
      // if (!context.user) return new Error("Please Login First");

      const user = await Employee.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          {
            user_id: user._id,
            email,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "2h",
          }
        );
        user.token = token;
        return {
          _id: user.id,
          ...user._doc,
          token,
        };
      } else {
        throw new ApolloError(`Incorrect Password`, "INCORRECT_PASSWORD");
      }
    },
    async createEmployee(
      _,
      {
        employeeInput: {
          name,
          department,
          email,
          skill_intro,
          contact,
          intro,
          projects,
          educations,
          skills,
          userImage,
        },
      },
      context
    ) {
      if (!context.user)
        return new ApolloError("Please Login First", "LOGIN_REQUIRED");

      const oldUser = await Employee.findOne({ email });
      if (oldUser) {
        throw new ApolloError(
          `User already exists with the name ${email}`,
          "USER_ALREADY_EXISTS"
        );
      }

      // var encryptedPassword = await bcrypt.hash(password, 10);
      var data = {
        name,
        department,
        email,
        skill_intro,
        contact,
        intro,
        projects,
        educations,
        skills,
        userImage,
      };

      const newEmployee = new Employee(data);

      // const token = jwt.sign(
      //   {
      //     user_id: newEmployee._id,
      //     email,
      //   },
      //   process.env.SECRET_KEY,
      //   {
      //     expiresIn: "2h",
      //   }
      // );

      const result = await newEmployee.save();
      return {
        _id: result.id,
        ...result._doc,
        // token,
      };
    },

    async deleteEmployee(_, { _id }, context) {
      if (!context.user)
        return new ApolloError("Please Login First", "LOGIN_REQUIRED");

      const result = await Employee.findByIdAndRemove({ _id });
      if (result) {
        await deleteEmployeeIdFromCompany(_id);
        return result;
      } else {
        return new ApolloError("ID not found", "NO_RECORD");
      }
    },

    // findByIdAndRemove

    async updateEmployee(_, { _id, employeeInput }, context) {
      // if (!context.user)
      //   return new ApolloError("Please Login First", "LOGIN_REQUIRED");
      const updatedUser = await Employee.findOneAndUpdate(
        { _id },
        employeeInput,
        { new: true }
      );
      return updatedUser;
    },
  },
  Query: {
    async getEmployees(_, __, context) {
      if (!context.user)
        return new ApolloError("Please Login First", "LOGIN_REQUIRED");

      const employee = await Employee.find({});
      return employee;
    },

    async getEmployee(_, { _id }, context) {
      // if (!context.user)
      //   return new ApolloError("Please Login First", "LOGIN_REQUIRED");

      const employee = await Employee.findById(_id);
      try {
        if (employee) {
          return employee;
        } else {
          return new Error("Employee not found");
        }
      } catch (err) {
        return err;
      }
    },
  },
};

module.exports = employeeResolvers;
