import React, { useEffect, useState } from 'react'

function App () {
  const [backendData, setBackendData] = useState([{}])
  const [message1, setMessage1] = useState('');
  const [message2, setMessage2] = useState('');
  const [message3, setMessage3] = useState('');

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  })
  const backendwrapper = () => {
    sendMessageToBackend("1" + message1);
    sendMessageToBackend("2" + message2);
    sendMessageToBackend("3" + message3);
  }
  const sendMessageToBackend = (message) => {
    fetch('/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Message sent successfully:', data);
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  };
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
      {(typeof backendData.users === 'undefined') ? (
        <p>loading...</p>
      ): (
        backendData.users.map((user, i) => (
          <p key={i}>{user}</p>
        ))
      )}
    </div>
  )
}

export default App