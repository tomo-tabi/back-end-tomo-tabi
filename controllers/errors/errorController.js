const { INTERNAL_SERVER_ERROR } = require('./errorConstants');

function handleInternalServerError(error, res) {
  console.error(error);
  return res.status(500).json(INTERNAL_SERVER_ERROR);
}

function checkForUndefined() {
  return [...arguments].includes(undefined);
}

module.exports = {
  handleInternalServerError,
  checkForUndefined,
};
