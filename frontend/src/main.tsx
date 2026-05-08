import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            borderRadius: '10px',
            background: '#1E3A5F',
            color: '#FFFFFF',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
