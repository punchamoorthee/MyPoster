// src/index.js
import React from 'react';
import ReactDOM from 'react-dom'; // <--- Change this import
import './index.css';
import App from './App';

// Use the legacy ReactDOM.render API
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Pass the root element directly
);