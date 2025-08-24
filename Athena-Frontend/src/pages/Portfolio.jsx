import Card from '../components/Card'
import StatPill from '../components/StatPill'
import { profile, weekly } from '../data/mock'
import { ChevronRight, History, BookOpen, ClipboardList } from 'lucide-react'


export default function Portfolio() {
return (
<div className="space-y-4">
<Card>
<div className="flex items-center gap-3">
<img src="https://api.dicebear.com/7.x/thumbs/svg?seed=Christy" alt="Christy" className="w-12 h-12 rounded-full" />
<div className="flex-1">
<h2 className="font-semibold">{profile.name}</h2>
<p className="text-sm text-gray-500">K2 · 目前積分 {profile.points}</p>
</div>
<span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">升級目標：{profile.nextLevel}</span>
</div>
<div className="grid grid-cols-2 gap-2 mt-4">
<StatPill label="本週打卡" value={`${weekly.checkinDays} 天`} />
<StatPill label="完成課程" value={`${weekly.courseCount} 節`} />
<StatPill label="作業分數" value={`${weekly.score}/100`} />
<StatPill label="超越同齡人" value={`${weekly.percentile}%`} />
</div>
</Card>


<Card>
<div className="flex items-center justify-between">
<h3 className="font-semibold">快捷入口</h3>
<span className="text-xs text-gray-500">{weekly.range}</span>
</div>
<div className="grid grid-cols-3 gap-3 mt-3">
<Quick icon={<History className="w-5 h-5" />} title="Course History" to="/course" />
<Quick icon={<BookOpen className="w-5 h-5" />} title="語文/數學" to="/course" />
<Quick icon={<ClipboardList className="w-5 h-5" />} title="作業" to="/assignment" />
</div>
</Card>


<Card>
<div className="flex items-center justify-between">
<h3 className="font-semibold">查看學習報告</h3>
<ChevronRight className="w-5 h-5 text-gray-400" />
</div>
<p className="text-sm text-gray-500 mt-1">一鍵查看每週表現與亮點</p>
</Card>
</div>
)
}


function Quick({ icon, title, to }) {
return (
<a href={to} className="p-3 rounded-xl bg-brand-50 text-brand-700 flex items-center gap-2">
<div className="p-2 rounded-lg bg-white shadow-soft">{icon}</div>
<span className="text-sm font-medium">{title}</span>
</a>
)
}
