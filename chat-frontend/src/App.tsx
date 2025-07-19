import './App.css'
import { useEffect, useRef, useState } from 'react'
import { ChatRoom } from './components/ChatRoom';
import { ChatJoin } from './components/ChatJoin';

{/*
Things left to complete:
1. When user closes the chat room and redirects back to ChatJoin page, a manual refresh is required now - automate that.
2. Cleaning rooms, when no user is left there.
3. manage UI for Sender/Receiver messages
*/}

function App() {
  const [open, setOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;

    socket.onopen = () => console.log("✅ WebSocket connected");
    socket.onclose = () => console.log("❌ WebSocket disconnected");
    socket.onerror = (e) => console.error("⚠️ WebSocket error", e);

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 z-50 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded shadow"
      >
        {darkMode ? '🌞 Light' : '🌙 Dark'}
      </button>
      <div className='h-screen w-screen bg-black flex items-center justify-center'>
        {open ? <ChatRoom setOpen={setOpen} roomCode={roomCode} socketRef={socketRef} username={username} /> : <ChatJoin setOpen={setOpen} setRoomCode={setRoomCode} socketRef={socketRef} setUsername={setUsername} />}
      </div>
    </div>
  )
}

export default App