import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LeadDashboard from './pages/LeadDashboard'
import OpportuniesDashboard from './pages/OpportuniesDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LeadDashboard />} />
        <Route path="/opportunities" element={<OpportuniesDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
