export default function StatPill({ label, value }) {
return (
<div className="px-3 py-2 rounded-xl bg-brand-50 text-brand-700 text-sm font-medium flex items-center justify-between">
<span className="opacity-80">{label}</span>
<span className="text-brand-700 font-bold">{value}</span>
</div>
)
}
