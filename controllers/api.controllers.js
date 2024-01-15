const { end } = require("../db/connection");
const endpointsData = require("../endpoints.json");

exports.getApi = (req, res) => {
  console.log(endpointsData);
  res.status(200).send(endpointsData);
};
