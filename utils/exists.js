const knex = require('../db/knex');

async function inviteExists(senderid, receiverid, tripid) {
  try {
    const exists = await knex
      .select('*')
      .from('invites')
      .where({ sender_id: senderid, receiver_id: receiverid, trip_id: tripid });

    return !!exists.length;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  inviteExists,
};
