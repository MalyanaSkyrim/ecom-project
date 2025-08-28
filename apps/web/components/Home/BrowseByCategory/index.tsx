import Image from 'next/image'

import { classMerge } from '@ecom/ui/lib/utils'

type Category = {
  id: string
  name: string
  imageUrl: string
}

const categories: Category[] = [
  {
    id: 'casual',
    name: 'Casual',
    imageUrl: '/img/categories/casual.png',
  },
  {
    id: 'formal',
    name: 'Formal',
    imageUrl: '/img/categories/formal.png',
  },
  {
    id: 'party',
    name: 'Party',
    imageUrl: '/img/categories/party.png',
  },
  {
    id: 'gym',
    name: 'Gym',
    imageUrl: '/img/categories/gym.png',
  },
]

const BrowseByCategory = () => {
  return (
    <div className={classMerge('section_container', '!py-0')}>
      <div className="mx-auto max-w-5xl space-y-9 rounded-[40px] bg-[#F0F0F0] px-6 py-9 md:px-10 lg:space-y-12 lg:px-16 lg:py-14">
        <h1 className="section_title">Browse by dress style</h1>
        <div className="grid aspect-[1.5] grid-cols-1 gap-5 md:grid-cols-11 md:grid-rows-2 md:gap-4 lg:gap-5">
          {categories.map((category, index) => (
            <button
              key={category.id}
              className={classMerge(
                'xs:h-[200px] group relative flex h-[180px] flex-col overflow-hidden rounded-[20px] bg-white text-left outline-none transition-all md:h-auto',
                'hover:-translate-y-1 hover:shadow-lg focus:-translate-y-1 focus:shadow-lg',
                index === 1 || index === 2 ? 'md:col-span-7' : 'md:col-span-4',
              )}>
              <div className="px-4 py-5 2xl:px-7 2xl:py-6">
                <h3 className="relative text-3xl font-bold 2xl:text-4xl">
                  {category.name}
                </h3>
              </div>
              <div className="absolute right-0 h-[300px] w-[50%] overflow-hidden">
                <Image
                  className="h-full w-full object-cover"
                  src={category.imageUrl}
                  width={300}
                  height={300}
                  alt="category image"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BrowseByCategory
