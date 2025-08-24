import Card from '../components/Card'
import { courses } from '../data/mock'

export default function Course() {
  return (
    <div className="space-y-4 p-4">
      <h2 className="font-bold text-lg">課程列表</h2>
      {courses.map((c, idx) => (
        <Card key={idx}>
          <div className="flex justify-between items-center">
            <span className="font-medium">{c.title}</span>
            <span className="text-xs text-gray-500">{c.progress}% 完成</span>
          </div>
        </Card>
      ))}
    </div>
  )
}
