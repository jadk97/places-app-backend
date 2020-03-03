const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  }
  catch (err) {
    const error = new HttpError("Fetching users failed, please try again later", 500);
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
}

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs passed, please check your data.", 422);
    return next(error);
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });

  }
  catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("There's already a user registered under that email address, please login instead", 422);
    return next(error);
  }

  let hashedPassword;
  try{
    hashedPassword = await bcrypt.hash(password, 12);
  }
  catch(err){
    const error = new HttpError("Could not create user, please try again.", 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: []
  });

  try {
    await createdUser.save();
  }
  catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
}

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });

  }
  catch (err) {
    const error = new HttpError("Logging in failed, please try again", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Invalid credentials, could not log you in.", 401);
    return next(error);
  }

  let isValidPassword = false;
  try{
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  }
  catch(err){
    const error = new HttpError("Couldn not log you in, please check your credentials and try again", 500);
    return next(error);
  }

  if(!isValidPassword){
    const error = new HttpError("Invalid credentials, could not log you in.", 401);
    return next(error);
  }


  res.json({ message: "Successfully logged in.", user: existingUser.toObject({ getters: true }) })
}

module.exports = { getUsers, signup, login }