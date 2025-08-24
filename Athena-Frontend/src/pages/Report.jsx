import Card from '../components/Card'
import { weekly } from '../data/mock'

export default function Report() {
  return (
    <div className="space-y-4 p-4">
      <h2 className="font-bold text-lg">學習報告</h2>
      <Card>
        <p className="text-sm text-gray-500">{weekly.range}</p>
        <p className="mt-2 text-gray-700">
          本週完成課程 {weekly.courseCount} 節，
          平均分 {weekly.score}/100，超越同齡人 {weekly.percentile}%。
        </p>
      </Card>
      <Card>
        <h3 className="font-semibold">老師評語</h3>
        <p className="text-sm text-gray-600 mt-2">
          Christy 對語文嘅理解更深入，數學掌握咗加減概念，保持專注進步！
        </p>
      </Card>
    </div>
  )
}
