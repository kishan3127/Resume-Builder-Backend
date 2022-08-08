const { ApolloError } = require("apollo-server");

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userResolvers = {
  Mutation: {
    async loginUser(_, { loginInput: { email, password } }, context) {
      const user = await User.findOne({ email });

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
          expiresIn: 1,
        };
      } else {
        throw new ApolloError(`Incorrect Credentails`, "INCORRECT_CREDENTIALS");
      }
    },
    async createUser(
      _,
      { userCreateInput: { email, name, password, role } },
      context
    ) {
      if (!context.user)
        return new ApolloError("Please Login First", "LOGIN_REQUIRED");

      if (context.user.role !== "SUPERADMIN" && context.user.role !== "ADMIN") {
        return new ApolloError(
          "You Don't have the authorization.",
          "UNAUTHORIZED"
        );
      }

      const oldUser = await User.findOne({ email });

      if (oldUser) {
        throw new ApolloError(
          `User already exists with the email ${email}`,
          "USER_ALREADY_EXISTS"
        );
      }

      if (role == "SUPERADMIN") {
        throw new ApolloError(
          `You can't create user with ${role}`,
          "INVALID_USER_ROLE"
        );
      }

      var encryptedPassword = await bcrypt.hash(password, 10);
      var data = {
        email,
        name,
        role,
        password: encryptedPassword,
      };

      const newUser = new User(data);

      const token = jwt.sign(
        {
          user_id: newUser._id,
          email,
          role,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      const result = await newUser.save();

      return {
        _id: result.id,
        password: result.password,
        ...result._doc,
        expiresIn: 1,
        token,
      };
    },
  },
  Query: {
    async getUsers(_, __, context) {
      if (!context.user)
        return new ApolloError("Please Login First", "LOGIN_REQUIRED");

      if (context.user.role !== "SUPERADMIN" && context.user.role !== "ADMIN") {
        return new ApolloError(
          "You Don't have the authorization.",
          "UNAUTHORIZED"
        );
      }

      const user = await User.find({});
      return user;
    },

    async getUser(_, { _id }, context) {
      if (!context.user)
        return new ApolloError("Please Login First", "LOGIN_REQUIRED");

      if (context.user.role !== "SUPERADMIN" && context.user.role !== "ADMIN") {
        return new ApolloError(
          "You Don't have the authorization.",
          "UNAUTHORIZED"
        );
      }

      const user = await User.findById(_id);
      try {
        if (user) {
          return user;
        } else {
          return new Error("User not found");
        }
      } catch (err) {
        return err;
      }
    },
  },
};

module.exports = userResolvers;
