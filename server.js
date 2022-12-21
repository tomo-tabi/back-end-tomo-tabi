require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./db/knex');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
