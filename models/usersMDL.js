const connection = require('../db/data/connections');

const fetchAllUsers = () => {
  return connection
    .select('*')
    .from('users')
    .then((usersRows) => {
      return { users: usersRows };
    });
};

const fetchUserByUsername = (req) => {
  const username = req.params.username;
  return connection
    .select('*')
    .from('users')
    .where('username', '=', username)
    .then((userRows) => {
      return { requestedUser: userRows[0] };
    });
};
module.exports = { fetchAllUsers, fetchUserByUsername };
