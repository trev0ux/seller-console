import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LeadDashboard from './pages/LeadDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LeadDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
