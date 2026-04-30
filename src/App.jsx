import { useState, useEffect } from 'react'
import React from 'react'
import './App.css'
import './index.css'
import {Dashboard} from "./routes/Dashboard"
import AdminAssistant from './components/AdminAssitant'
function App() {
  const [count, setCount] = useState(0)


  return (
    <>
<Dashboard />
<AdminAssistant />
    </>
  )
}

export default App