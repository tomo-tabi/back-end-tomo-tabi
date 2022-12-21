require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const timeout = require('connect-timeout');
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(timeout('5s'));

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
