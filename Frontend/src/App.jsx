import { useState } from 'react'
import './App.css'
import Header from './layout/Header'
import Hero from './layout/Hero'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
    <Hero/>
    </>
  )
}

export default App
