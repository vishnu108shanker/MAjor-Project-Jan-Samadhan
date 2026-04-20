/**
 * Application Entry Point
 * 
 * Initializes the React application and renders the root App component
 * into the DOM element with id 'root'. Uses StrictMode for development
 * to highlight potential issues in the application.
 * 
 * @module main
 * @requires react
 * @requires react-dom/client
 * @requires ./App.jsx
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
