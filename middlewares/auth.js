const { verify } = require("jsonwebtoken");
const { ApolloError } = require("apollo-server-express");

const SECRET = process.env.SECRET_KEY;

const User = require("../models/user");

const AuthMiddleware = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  let token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  let decodedToken;

  try {
    decodedToken = verify(token, SECRET);
  } catch (error) {
    req.isAuth = false;
    // throw new ApolloError(error, "LOGIN_REQUIRED");
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  let authUser = await User.findById(decodedToken.user_id);
  if (!authUser) {
    req.isAuth = false;
    return next();
  }

  req.user = authUser;
  req.isAuth = true;

  return next();
};

module.exports = { AuthMiddleware };
