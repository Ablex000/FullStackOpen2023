import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { NotificationContextProvider } from './contexts/NotificationContext'
import { UserContextProvider } from './contexts/UserContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router } from 'react-router-dom'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <NotificationContextProvider>
            <App />
          </NotificationContextProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>,
)
