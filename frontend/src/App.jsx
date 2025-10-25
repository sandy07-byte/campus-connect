import React from 'react'
import AppRoutes from './Components/Router/Routes'
import { SocketProvider } from './context/SocketContext'

function App() {
  return (
    <SocketProvider>
      <AppRoutes />
    </SocketProvider>
  )
}

export default App