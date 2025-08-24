import { ShieldCheck } from 'lucide-react'


export default function TopBar() {
return (
<header className="sticky top-0 z-20 bg-white/90 backdrop-blur card pt-3 pb-3 rounded-none shadow-soft">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<img src="https://api.dicebear.com/7.x/thumbs/svg?seed=Christy" alt="avatar" className="w-8 h-8 rounded-full" />
<div className="leading-tight">
<p className="text-sm text-gray-500">Christy • K2</p>
<h1 className="text-base font-semibold">Christy AI 學習週報</h1>
</div>
</div>
<div className="flex items-center gap-2 text-brand-600">
<ShieldCheck className="w-5 h-5" />
<span className="text-xs">學習守護</span>
</div>
</div>
</header>
)
}
