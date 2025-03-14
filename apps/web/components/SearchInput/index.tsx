import { Search } from 'lucide-react'

const SearchInput = () => {
  return (
    <div className="relative h-8 rounded-[62px] bg-[#F0F0F0]">
      <Search className="absolute left-2 top-1/2 h-[20px] w-[20px] -translate-y-1/2 text-gray-400" />
      <input className="h-full w-full rounded-[62px] bg-transparent pl-8 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-gray-700"></input>
    </div>
  )
}

export default SearchInput
