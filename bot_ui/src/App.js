import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import ChatWithBot from './chat_with_bot/chat_with_bot';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatWithBot />} />
      </Routes>
    </Router>
  );
}

export default App;
