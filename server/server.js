const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'miniproject'
};

const connection = mysql.createConnection(dbConfig);

app.use(cors());
app.use(express.json()); // Add this line to parse JSON requests

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.get('/profile/:phoneNumber', (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  const query = `SELECT * FROM user_profile WHERE phone_number = ?`;

  connection.query(query, [phoneNumber], (err, results) => {
    if (err) {
      console.error('Error querying MySQL: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const userProfile = results[0];
    res.json(userProfile);
  });
});

// Endpoint to verify account address and phone number
app.post('/verify', (req, res) => {
  const { account, phone } = req.body;
  const query = `SELECT * FROM user_profile WHERE account_address = ? AND phone_number = ?`;

  connection.query(query, [account, phone], (err, results) => {
    if (err) {
      console.error('Error querying MySQL: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const isVerified = results.length > 0;
    res.json({ isVerified });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});