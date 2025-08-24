import Card from '../components/Card'
import { assignments } from '../data/mock'

export default function Assignment() {
  return (
    <div className="space-y-4 p-4">
      <h2 className="font-bold text-lg">作業進度</h2>
      {assignments.map((a, idx) => (
        <Card key={idx}>
          <div className="flex justify-between">
            <span>{a.title}</span>
            <span className="text-sm text-gray-500">{a.status}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}
