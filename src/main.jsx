import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { seedIfEmpty } from './state/seed'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

// Seed demo data if storage is empty (optional)
seedIfEmpty()
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

