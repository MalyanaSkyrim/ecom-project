import { classMerge } from '@ecom/ui/lib/utils'

type ShopStat = {
  value: number
  label: string
}

const statsData: ShopStat[] = [
  {
    value: 200,
    label: 'International Brands',
  },
  {
    value: 2000,
    label: 'High-Quality Products',
  },
  {
    value: 30000,
    label: 'Happy Customers',
  },
]

const StatsBanner: React.FC = () => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  return (
    <div className="flex items-center space-x-6">
      {statsData.map((stat, index) => {
        const isLast = index === statsData.length - 1
        return (
          <div
            key={index}
            className={classMerge('text-left', !isLast && 'border-r-2 pr-5')}>
            <div className="mb-1 text-4xl font-bold text-black md:text-4xl">
              {formatNumber(stat.value)}+
            </div>
            <div className="text-lg text-gray-600">{stat.label}</div>
          </div>
        )
      })}
    </div>
  )
}
export default StatsBanner
