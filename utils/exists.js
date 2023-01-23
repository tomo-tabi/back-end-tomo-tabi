const knex = require('../db/knex');

async function inviteExists (senderId, receiverId) {
  try {
    const exists = await knex
      .select('*')
      .from('invites')
      .where({ sender_id: senderId, receiver_id: receiverId });
    
    return !!exists.length;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  inviteExists,
};
