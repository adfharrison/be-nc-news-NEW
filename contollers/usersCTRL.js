const { fetchAllUsers, fetchUserByUsername } = require('../models/usersMDL');

const getAllUsers = (req, res, next) => {
  fetchAllUsers(req)
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) => {
      next(error);
    });
};

const getUserByUsername = (req, res, next) => {
  fetchUserByUsername(req)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getAllUsers, getUserByUsername };
