require('dotenv').config();

const express = require('express');

const app = express();
const cors = require('cors');
const timeout = require('connect-timeout');

const port = process.env.PORT || 8080;
const userRoutes = require('./routes/users/userRoutes');
const tripRoutes = require('./routes/trips/tripRoutes');
const timelineRoutes = require('./routes/timeline/timelineRoutes');
const expenseRoutes = require('./routes/expenses/expenseRoutes');
const inviteRoutes = require('./routes/invites/inviteRoutes');

app.use(cors());
app.use(express.json());
app.use(timeout('5s'));

app.use('/user', userRoutes);
app.use('/trip', tripRoutes);
app.use('/timeline', timelineRoutes);
app.use('/expense', expenseRoutes);
app.use('/invite', inviteRoutes);

app.get('*', (req, res) => {
  return res.sendStatus(404);
});

app.listen(port, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port: ${port}`);
});

module.exports = app;
