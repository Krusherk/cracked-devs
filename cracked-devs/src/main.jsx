// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// App.jsx
import React from 'react';
import WalletConnect from './components/WalletConnect';
import ChatView from './multisynq/ChatView';
import './App.css';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-900 text-white font-comic">
      <header className="text-4xl font-bold mt-6">CRACKED DEVS</header>
      <main className="flex-grow w-full max-w-3xl p-4">
        <WalletConnect />
        <ChatView />
      </main>
      <footer className="text-sm mb-4 italic">Made by Crack</footer>
    </div>
  );
}


// components/WalletConnect.jsx
import React from 'react';
import WalletButton from './WalletButton';

export default function WalletConnect() {
  return (
    <div className="mb-4">
      <WalletButton />
    </div>
  );
}


// components/WalletButton.jsx
import React from 'react';
import { useWallet } from '../hooks/useWallet';

export default function WalletButton() {
  const { address, connect } = useWallet();

  return (
    <button onClick={connect} className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-xl">
      {address ? `Connected: ${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
    </button>
  );
}


// hooks/useWallet.js
import { useState } from 'react';
import { ethers } from 'ethers';

export function useWallet() {
  const [address, setAddress] = useState(null);

  const connect = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAddress(accounts[0]);
    } else {
      alert('MetaMask is not installed');
    }
  };

  return { address, connect };
}


// multisynq/ChatView.jsx
import React, { useEffect, useState } from 'react';
import ChatBox from '../components/ChatBox';
import { generateRandomName } from '../utils/names';

export default function ChatView() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    setUsername(generateRandomName());
  }, []);

  return (
    <div>
      <p className="text-lg mb-2">Username: <span className="font-bold">{username}</span></p>
      <ChatBox username={username} />
    </div>
  );
}


// components/ChatBox.jsx
import React, { useState } from 'react';
import Message from './Message';

export default function ChatBox({ username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { username, text: input }]);
    setInput('');
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="border rounded-lg p-3 h-64 overflow-y-auto bg-white text-black">
        {messages.map((msg, index) => (
          <Message key={index} username={msg.username} text={msg.text} />
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type your message..."
        className="border p-2 rounded text-black"
      />
      <button onClick={sendMessage} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded">
        Send
      </button>
    </div>
  );
}


// components/Message.jsx
import React from 'react';

export default function Message({ username, text }) {
  return (
    <div className="mb-1">
      <span className="font-semibold text-purple-700">{username}: </span>
      <span>{text}</span>
    </div>
  );
}


// utils/names.js
const names = ['Jack', 'Annie', 'Mona', 'Leo', 'Sky', 'Zara', 'Nina', 'Max', 'Nova', 'Kai'];

export function generateRandomName() {
  return names[Math.floor(Math.random() * names.length)];
}


// App.css
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue&display=swap');

body {
  margin: 0;
  font-family: 'Comic Neue', cursive;
  background-color: #111827;
  color: white;
}


// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // important for relative paths when deploying
});
