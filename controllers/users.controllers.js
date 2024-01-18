const { fetchUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch(next);
};
