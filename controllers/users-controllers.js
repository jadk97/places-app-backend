const uuid = require("uuid/v4");
const HttpError = require("../models/http-error");
const DUMMY_USERS = [
  {
    id: "u1",
    name: "John Doe",
    email: "test@email.com",
    password: "test12345"
  }
];

const getUsers = (req, res, next) => {
  res.json({users: DUMMY_USERS});
}

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find(u => u.email === email);

  if(hasUser){
    const error = new HttpError("An account has already been registered under that email.", 422);
    return next(error);
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password
  }
  DUMMY_USERS.push(createdUser);
  res.status(201).json({user: createdUser});
}

const login = (req, res, next) => {
  const {email, password} = req.body;
  
  const identifiedUser = DUMMY_USERS.find(u => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password){
    const error = new HttpError("Invalid login credentials.", 401);
    return next(error);
  }

  res.json({message: "Successfully logged in."})
}

module.exports = {getUsers, signup, login}