const uuid = require("uuid/v4");

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

}

module.exports = {getUsers, signup, login}