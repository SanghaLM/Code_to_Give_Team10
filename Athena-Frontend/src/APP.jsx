import { Routes, Route, Navigate } from 'react-router-dom'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import Portfolio from './pages/Portfolio'
import Report from './pages/Report'
import Points from './pages/Points'
import Course from './pages/Course'
import Assignment from './pages/Assignment'


export default function App() {
return (
<div className="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col">
<TopBar />
<div className="flex-1 px-4 pb-24 pt-3 space-y-4">
<Routes>
<Route path="/" element={<Navigate to="/portfolio" replace />} />
<Route path="/portfolio" element={<Portfolio />} />
<Route path="/report" element={<Report />} />
<Route path="/points" element={<Points />} />
<Route path="/course" element={<Course />} />
<Route path="/assignment" element={<Assignment />} />
</Routes>
</div>
<BottomNav />
</div>
)
}
