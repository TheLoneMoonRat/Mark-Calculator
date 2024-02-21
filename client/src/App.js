import React, { useEffect, useState } from 'react'


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

  const backendwrapper = () => {
    sendMessageToBackend("1" + message1 + " " + username, '/userdata/send-message');
    sendMessageToBackend("2" + message2 + " " + username, '/userdata/send-message');
    sendMessageToBackend("3" + message3 + " " + username, '/userdata/send-message');
  }

  const sendAccountData = () => {
    const myoutput = username + ' ' + password + ' ' + term + ' ' + degree + ' ' + id;
    sendMessageToBackend(myoutput, '/logindata');
    setUser(true);
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
          <button onClick={backendwrapper}>Send Message to Backend</button>
          <input
            type="text"
            value={message1}
            onChange={e => setMessage1(e.target.value)}
            placeholder="Enter your message"
          />
          <input
            type="text"
            value={message2}
            onChange={e => setMessage2(e.target.value)}
            placeholder="Enter your message"
          />
          <input
            type="text"
            value={message3}
            onChange={e => setMessage3(e.target.value)}
            placeholder="Enter your message"
          />
        </div>
        {(typeof backendData.grades === 'undefined') ? (
          <p>loading...</p>
        ): (
          backendData.grades.map((grade, i) => (
            <p key={i}>{grade}</p>
          ))
        )}
      </div>
      )
  }
  const changeuser = () => {
    setUser(false);
  }
  const verifydata = () => {
    const myoutput = username + ' ' + password;
    sendMessageToBackend(myoutput, '/logindata');
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
            placeholder="What is your degree in?"
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

  if (loggedin) {
    return (
      infodisplay()
    )
  } else if (isUser) {
    return (
      loginuser()
    )
  } else {
    return (
      createuser()
    )
  }
}

export default App