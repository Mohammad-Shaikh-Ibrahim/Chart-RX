import './App.css'
import ChartWithRx from './ChartWithRx'
import { Routes, Route } from 'react-router-dom'

//
function App() {
  return (
    <Routes>
      <Route path="/" element={<ChartWithRx />} />
    </Routes>
  )
}

export default App