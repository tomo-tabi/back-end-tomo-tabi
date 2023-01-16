require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const timeout = require('connect-timeout');
const port = process.env.PORT || 8080;

// Import route files
const userRoutes = require('./routes/users/userRoutes');
const tripRoutes = require('./routes/trips/tripRoutes');
const timelineRoutes = require('./routes/timeline/timelineRoutes');
const expenseRoutes = require('./routes/expenses/expenseRoutes');
const inviteRoutes = require('./routes/invites/inviteRoutes');

// Initialize server utilities
app.use(cors());
app.use(express.json());
app.use(timeout('5s'));

// Internal API routes
app.use('/user', userRoutes);
app.use('/trip', tripRoutes);
app.use('/timeline', timelineRoutes);
app.use('/expense', expenseRoutes);
app.use('/invite', inviteRoutes);

// function to check if the request has timed out
// function haltOnTimedout(req, res, next) {
//   if (!req.timedout) next();
// }

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

module.exports = app;
