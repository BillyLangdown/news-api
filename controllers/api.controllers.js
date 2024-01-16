const { end } = require("../db/connection");
const endpointsData = require("../endpoints.json");

exports.getApi = (req, res) => {
  res.status(200).send(endpointsData);
};
