const express = require('express');
const bodyParser = require('body-parser'); // Added for parsing JSON in the request body
const sql = require('mssql');
app.listen(process.env.PORT, () => { console.log(`Server started at port ${process.env.PORT}`) });
const cors = require('cors');
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
app.use(cors());
app.use(bodyParser.json());
sql.connect(config)
  .then(pool => {
    console.log('Connected to the database');
  })

  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

//sending information to client from the sql database
app.post('/userdata', (req, res) => {
  var { message } = req.body;
  var term1a;
  if (message) {
    sql.connect(config)
    .then(pool => {
      // console.log('Retrieving from the database');
      return pool.request()
        .query(`SELECT mark1, mark2, mark3
                FROM mygrades
                WHERE username IN ('${message}');`);
    })
    .then(result => {
      // const row1 = result.recordset[0];
      term1a = Object.values(result.recordset[0]);
      res.json({ grades: term1a });
    })
    .catch(err => {
      console.error('Error connecting to the database:', err);
    });
  }
});

app.post('/logindata', (req, res) => {
  var password;
  var { message } = req.body;
  const myoutput = message.split(' ');
        
  sql.connect(config)
  .then(pool => {
    // console.log('Retrieving from the database');
    if (myoutput.length > 2) {
      return pool.request()
      .query(`INSERT INTO usertable (username, password, term, degree, identification)
              VALUES ('${myoutput[0]}', '${myoutput[1]}', ${myoutput[2]}, '${myoutput[3]}', ${myoutput[4]});
              INSERT INTO mygrades (mark1, mark2, mark3, studentid, username)
              VALUES (0, 0, 0, ${myoutput[4]}, '${myoutput[0]}');`);
    } else {
      return pool.request()
      .query(`SELECT password
              FROM usertable
              WHERE username IN ('${myoutput[0]}');`)      
      .then(result => {
        if (result.recordset.length > 0) {
          password = result.recordset[0].password;
          if (myoutput.length == 2) {
            if (password == myoutput[1]) {
              res.json({ success: true });
            } else {
              res.json({ success: false });
            }
          }
        } else {
          console.log('Username not found');
        }
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
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });
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
        message = message.split(' ');
        if (rank == "1") {
          return pool.request()
            .query(`update mygrades set mark1 = ${message[0]} where username = '${message[1]}';`);
        } else if (rank == "2") {
          return pool.request()
            .query(`update mygrades set mark2 = ${message[0]} where username = '${message[1]}';`);
        } else {
          return pool.request()
            .query(`update mygrades set mark3 = ${message[0]} where username = '${message[1]}';`);
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