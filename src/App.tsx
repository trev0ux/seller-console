import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LeadDashboard from './pages/LeadDashboard'
import OpportuniesDashboard from './pages/OpportuniesDashboard'
import AppHeader from './components/molecules/AppHeader'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <AppHeader />
        <Routes>
          <Route path="/" element={<LeadDashboard />} />
          <Route path="/opportunities" element={<OpportuniesDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
