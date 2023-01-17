const knex = require('../db/knex');

const inviteExists = async function (senderId, receiverId) {
  try {
    const exists = await knex
      .select('*')
      .from('invites')
      .where({ sender_id: senderId, receiver_id: receiverId });

    return !!exists.length;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  inviteExists,
};
