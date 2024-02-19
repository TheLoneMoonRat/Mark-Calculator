const express = require('express');
const bodyParser = require('body-parser'); // Added for parsing JSON in the request body

  
const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON in the request body

var term1a = [1, 2, 3, 4]

app.get('/api', (req, res) => {
  res.json({ users: term1a });
});

app.post('/api/send-message', (req, res) => {
  const { message } = req.body;

  if (message) {
    console.log('Received message from client:', message);
    // You can handle the message as needed, e.g., store it in term1a array
    term1a.push(message);

    res.json({ success: true, message: 'Message received successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Message is missing in the request body' });
  }
});

app.listen(5000, () => { console.log("Server started at port 5000") })