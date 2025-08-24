import Card from '../components/Card'
import { profile } from '../data/mock'

export default function Points() {
  return (
    <div className="space-y-4 p-4">
      <h2 className="font-bold text-lg">積分中心</h2>
      <Card>
        <p className="text-gray-700">目前積分：{profile.points}</p>
        <ul className="mt-2 text-sm text-gray-600 list-disc pl-4">
          <li>完成課程 +5</li>
          <li>完成作業 +5</li>
          <li>每日打卡 +10</li>
        </ul>
      </Card>
    </div>
  )
}
