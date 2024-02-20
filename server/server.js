const express = require('express');
const bodyParser = require('body-parser'); // Added for parsing JSON in the request body
const sql = require('mssql');
const config = {
  user: 'n62wong',
  password: 'DerpMan100!',
  server: 'gradecalculator.database.windows.net',
  database: 'gradecalculator',
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 30000  // Increase the timeout to 30 seconds
  }
};
  
const app = express();
app.use(bodyParser.json());
var term1a;
sql.connect(config)
  .then(pool => {
    console.log('Connected to the database');
  })

  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

//sending information to client from the sql database
app.get('/userdata', (req, res) => {
  sql.connect(config)
  .then(pool => {
    // console.log('Retrieving from the database');
    return pool.request()
      .query(`SELECT mark1, mark2, mark3
              FROM mygrades
              WHERE studentid IN ('21023892');`);
  })
  .then(result => {
    // const row1 = result.recordset[0];
    term1a = Object.values(result.recordset[0]);
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });
  res.json({ users: term1a });
});

app.get('/logindata', (req, res) => {
  var { message } = req.body;
  const myoutput = message.split(' ');
        
  sql.connect(config)
  .then(pool => {
    // console.log('Retrieving from the database');
    var password;
    if (myoutput.length > 2) {
      return pool.request()
      .query(`INSERT INTO usertable 
              VALUES (${myoutput[0]}, ${myoutput[1]}, ${myoutput[2]}, ${myoutput[3]}, ${myoutput[4]});
              INSERT INTO mygrades
              VALUES (0, 0, 0, ${myoutput[4]}, ${myoutput[0]});`);
    } else {
      return pool.request()
      .query(`SELECT password
              FROM usertable
              WHERE username IN (${myoutput[0]});`)      
      .then(result => {
        password = result;
      })
    }
      // .query(`CREATE TABLE usertable (
      //           username varchar(255),
      //           password varchar(255),
      //           term int,
      //           degree varchar(255),
      //           identification int
      //         )`);
  })
  // .then(result => {
  //   // const row1 = result.recordset[0];
  //   term1a = Object.values(result.recordset[0]);
  // })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });
  if (myoutput.length == 2) {
    if (password == myoutput[1]) {
      res.json(true);
    } else {
      res.json(false);
    }
  }
});

//fetching information from the client, updating sql database
app.post('/userdata/send-message', (req, res) => {
  var { message } = req.body;

  if (message) {
    console.log('Received message from client:', message);

    // You can handle the message as needed, e.g., store it in term1a array
    sql.connect(config)
      .then(pool => {
        console.log('Updating the database');
        const rank = message[0];
        message = message.slice(1);
        if (rank == "1") {
          return pool.request()
            .query(`update mygrades set mark1 = ${message} where studentid = 21023892;`);
        } else if (rank == "2") {
          return pool.request()
            .query(`update mygrades set mark2 = ${message} where studentid = 21023892;`);
        } else {
          return pool.request()
            .query(`update mygrades set mark3 = ${message} where studentid = 21023892;`);
        }
      })
      .catch(err => {
        console.error('Error connecting to the database:', err);
      });
    res.json({ success: true, message: 'Message received successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Message is missing in the request body' });
  }
});

app.listen(5000, () => { console.log("Server started at port 5000") })