const { INTERNAL_SERVER_ERROR } = require('./errorConstants');

function handleInternalServerError(error, res) {
  console.error(error);
  res.send(500).json(INTERNAL_SERVER_ERROR);
}

module.exports = {
  handleInternalServerError,
};
