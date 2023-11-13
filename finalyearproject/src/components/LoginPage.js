import React, { useState } from 'react';
import './LoginPage.css'; // Importing the corresponding CSS file
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('')
  const navigate = useNavigate();


  function handleJoinClick() {
    // Handle join logic here, e.g., navigate to the room with roomId and username
    console.log(`Joining room ${roomId} as ${username}`);
    navigate("/codeeditor");
  };

  return (
    <div className="LoginPage">
      <div className="logo-container">
        
        <img src="/codelogo.png" alt="Logo" className="logo" />
        <h1>CodeSync</h1>
      </div>
      <div className="invitation-container">
        <p>Paste invitation room ID</p>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room ID"
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your Username"
        />
        <button onClick={handleJoinClick}>Join</button>
      </div>
      <div className="create-room-container">
        <p>If you don't have an invite, then create a <a href="/new-room">new room</a>.</p>
        {/* Add logic or a link to create a new room */}
      </div>

      <div className="divider">OR</div>

      <div className="single-room">
        <p>Don't want to collab, then join directly !!!</p>
        <button onClick={handleJoinClick}>Join</button>
      </div>
    </div>
  );
}

export default LoginPage;
