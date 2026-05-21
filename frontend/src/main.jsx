// ============================================================
// src/main.jsx — REACT ENTRY POINT
// This is the very first JS file React loads.
// It mounts the <App /> component into the <div id="root">
// in index.html. Also imports global CSS and the toast notifier.
// ============================================================

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter enables React Router navigation throughout the app */}
    <BrowserRouter>
      <App />
      {/* Toaster renders toast notification popups globally */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1545',
            color: '#e2e8f0',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: '12px',
            fontFamily: 'DM Sans, sans-serif',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
