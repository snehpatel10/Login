import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './components/LoginPage'
import SignUp from './components/SignupPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SignUp />
    </>
  )
}

export default App
