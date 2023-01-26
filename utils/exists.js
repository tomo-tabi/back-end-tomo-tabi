const knex = require('../db/knex');

async function inviteExists(senderid, receiverid, tripid) {
  const exists = await knex
    .select('*')
    .from('invites')
    .where({ sender_id: senderid, receiver_id: receiverid, trip_id: tripid });

  return !!exists.length;
}

module.exports = {
  inviteExists,
};
