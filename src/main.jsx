import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { UserProfileProvider } from './context/UserProfileContext';
import './index.css'

console.log('🌅 [DearLuna] Mounting initiated...');

const root = document.getElementById('root');
if (root) {
  root.innerHTML = '<div style="padding: 40px; text-align: center; color: #4A3525;"><h1>DearLuna is waking up...</h1><p>If this page stays here, check the console for errors.</p></div>';
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <UserProfileProvider>
      <App />
    </UserProfileProvider>
  </React.StrictMode>,
)
