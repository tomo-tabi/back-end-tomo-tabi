const USER_ID = 91344;
const TRIP_ID = 11344;

module.exports = {
  getUser() {
    return {
      id: 91344,
      username: 'user91344',
      email: 'jeanluc2@enterprise.fed',
      password: '54321',
    };
  },
  getTrip() {
    return {
      id: 11344,
      start_date: '2023-01-05',
      end_date: '2023-01-10',
      name: 'Tokyo',
    };
  },
  getTripEvent() {
    return {
      id: 45555,
      event_name: 'Moog Voyager Syntesizer',
      event_date: '2023-01-08',
      trip_id: 11344,
    };
  },
  getExpense() {
    return {
      id: 45555,
      user_id: USER_ID,
      item_name: 'coffee',
      money: 3300.00,
      trip_id: TRIP_ID,
    };
  },
};
