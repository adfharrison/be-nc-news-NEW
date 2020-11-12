const usersRouter = require('express').Router();

const {
  getAllUsers,
  getUserByUsername,
  postNewUser,
} = require('../contollers/usersCTRL.js');
const { send405 } = require('../errors');

usersRouter.route('/').get(getAllUsers).post(postNewUser).all(send405);
usersRouter.route('/:username').get(getUserByUsername).all(send405);

module.exports = usersRouter;
