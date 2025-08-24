import { NavLink } from 'react-router-dom'
import { Home, BarChart3, Gift, BookOpen, ClipboardList } from 'lucide-react'


const Item = ({ to, icon: Icon, label }) => (
<NavLink
to={to}
className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-2 rounded-xl ${isActive ? 'text-brand-600 bg-brand-50' : 'text-gray-500'}`}
>
<Icon className="w-5 h-5" />
<span className="text-[11px]">{label}</span>
</NavLink>
)


export default function BottomNav() {
return (
<nav className="fixed bottom-3 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
<div className="grid grid-cols-5 card rounded-2xl">
<Item to="/portfolio" icon={Home} label="Portfolio" />
<Item to="/report" icon={BarChart3} label="Report" />
<Item to="/points" icon={Gift} label="Points" />
<Item to="/course" icon={BookOpen} label="Course" />
<Item to="/assignment" icon={ClipboardList} label="Assignment" />
</div>
</nav>
)
}
