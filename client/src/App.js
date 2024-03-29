import React, { useEffect, useState } from 'react';
import './App.css';

function App () {
  const [backendData, setBackendData] = useState([{}])
  const [message1, setMessage1] = useState('');
  const [message2, setMessage2] = useState('');
  const [message3, setMessage3] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [term, setTerm] = useState('');
  const [degree, setDegree] = useState('');
  const [id, setID] = useState('');
  const [loggedin, login] = useState(false);
  const [isUser, setUser] = useState(true);
  const [homePage, goHome] = useState(true);

  useEffect(() => {
    if (loggedin) {
      var message = username;
      fetch("/userdata", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      }).then(response => response.json())
        .then (data => {
          setBackendData(data)
        }
      )
    }
  })

  const hasSpaces = (item) => {
    for (var i = 0; i < item.length; i++) {
      if (item[i] === " ") {
        return true;
      }
    }
    return false;
  }

  const backendwrapper = () => {
    if (!hasSpaces(message1) && !hasSpaces(message2) && !hasSpaces(message3) && !hasSpaces(username)) {
      sendMessageToBackend("1" + message1 + " " + username, '/userdata/send-message');
      sendMessageToBackend("2" + message2 + " " + username, '/userdata/send-message');
      sendMessageToBackend("3" + message3 + " " + username, '/userdata/send-message');
    }
  }

  const sendAccountData = () => {
    if (!hasSpaces(username) && !hasSpaces(password) && !hasSpaces(term) && !hasSpaces(degree) && !hasSpaces(id)) {
      const myoutput = username + ' ' + password + ' ' + term + ' ' + degree + ' ' + id;
      sendMessageToBackend(myoutput, '/logindata');
      setUser(true);
    }
  }

  const sendMessageToBackend = (message, address) => {
    fetch(address, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
      .then(response => response.json())
      .then(data => {
        if (address === "/logindata") {
          login(data.success);
        }
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  };

  function infodisplay () {
    return (
      <div>
        <div>
          <button onClick={backendwrapper}>Update my grades</button>
          <input
            type="text"
            value={message1}
            onChange={e => setMessage1(e.target.value)}
            placeholder="Enter mark 1 here"
          />
          <input
            type="text"
            value={message2}
            onChange={e => setMessage2(e.target.value)}
            placeholder="Enter mark 2 here"
          />
          <input
            type="text"
            value={message3}
            onChange={e => setMessage3(e.target.value)}
            placeholder="Enter mark 3 here"
          />
        </div>
        <h1 class="myheading">Your grades:</h1>
        {(typeof backendData.grades === 'undefined') ? (
          <p>loading...</p>
        ): (
          backendData.grades.map((grade, i) => (
            <p key={i}>Mark {i + 1}: {grade}</p>
          ))
        )}
      </div>
      )
  }
  const changeuser = () => {
    setUser(false);
  }
  const verifydata = () => {
    if (!hasSpaces(username) && !hasSpaces(password)) {
      const myoutput = username + ' ' + password;
      sendMessageToBackend(myoutput, '/logindata');
    }
  }

  function loginuser () {
    return (
      <div>
        <div>
          <button onClick={verifydata}>Log in</button>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="text"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <button onClick={changeuser}>Create an account</button>
      </div>
    )
  }

  function createuser () {
    return (
      <div>
        <div>
          <button onClick={sendAccountData}>Create account</button>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Choose a username"
          />
          <input
            type="text"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Choose a password"
          />
          <input
            type="text"
            value={term}
            onChange={e => setTerm(e.target.value)}
            placeholder="What term are you in (1 = 1A, 14 = 5B)?"
          />
          <input
            type="text"
            value={degree}
            onChange={e => setDegree(e.target.value)}
            placeholder="What is your degree in (no spaces)?"
          />
          <input
            type="text"
            value={id}
            onChange={e => setID(e.target.value)}
            placeholder="What is your student ID?"
          />
        </div>
      </div>
    )
  }

  const logOut = () => {
    login(false);
    setUser(true);
  }
  const changePlace = () => {
    if (homePage) {
      logOut();
      goHome(false);
    } else {
      goHome(true);
    }
  }
  if (homePage) {
    return (
        <body className="home">
            <header className="home-header">
                <h1>Student Marks Tracker</h1>
                <p>A website that allows students to track and update their marks.</p>
                <button onClick={changePlace}>Login</button>
            </header>

            <main className="home-main">
                <section className="home-description">
                    <h2>App Description</h2>
                    <p>Student Marks Tracker is a web application designed to help students keep track of their academic performance. It provides an intuitive interface for students to view and update their grades, making it easy to stay organized throughout their academic journey.</p>
                </section>

                <section className="home-technical-details">
                    <h2>Technical Details</h2>
                    <p>The application is built using modern web technologies:</p>
                    <ul>
                        <li><strong>Frontend:</strong> Developed with React for a dynamic and responsive user interface.</li>
                        <li><strong>Backend:</strong> Powered by Node.js and Express.js, providing a robust server-side infrastructure.</li>
                        <li><strong>Database:</strong> Utilizes SQL Server to store and manage user data and grades.</li>
                    </ul>
                </section>
            </main>

            <footer className="home-footer">
                <p>2024 Student Marks Tracker | Created by Nathan Wong</p>
                <div className="footer-links">
                    <a href="https://www.linkedin.com/in/nathan-wong-03362696/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="https://github.com/TheLoneMoonRat" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="https://thelonemoonrat.github.io" target="_blank" rel="noopener noreferrer">Personal Website</a>
                </div>
            </footer>
        </body>
    );
} else {
    if (loggedin) {
        return (
            <div className="user-container">
                <button onClick={changePlace}>Go Home</button>
                <div className="container">
                    <button onClick={logOut}>Log out</button>
                    {infodisplay()}
                </div>
            </div>
        );
    } else if (isUser) {
        return (
            <div className="user-container">
                <button onClick={changePlace}>Go Home</button>
                <div className="container">
                    {loginuser()}
                </div>
            </div>
        );
    } else {
        return (
            <div className="user-container">
                <button onClick={changePlace}>Go Home</button>
                <div className="container">
                    <button onClick={logOut}>Return to login</button>
                    {createuser()}
                </div>
            </div>
        );
    }
}

}

export default App