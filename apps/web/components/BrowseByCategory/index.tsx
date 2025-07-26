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
    imageUrl: 'https://img.icons8.com/ios/100/000000/t-shirt.png',
  },
  {
    id: 'formal',
    name: 'Formal',
    imageUrl: 'https://img.icons8.com/ios/100/000000/tie.png',
  },
  {
    id: 'party',
    name: 'Party',
    imageUrl: 'https://img.icons8.com/ios/100/000000/party-balloon.png',
  },
  {
    id: 'gym',
    name: 'Gym',
    imageUrl: 'https://img.icons8.com/ios/100/000000/dumbbell.png',
  },
]

const BrowseByCategory = () => {
  return (
    <div className={classMerge('section_container', '!py-0')}>
      <div className="space-y-12 rounded-[40px] bg-[#F0F0F0] px-16 py-14">
        <h1 className="section_title">Browse by dress style</h1>
        <div className="grid grid-cols-3 grid-rows-2 gap-5">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={classMerge(
                'h-[290px] rounded-[20px] bg-white',
                (index === 1 || index === 2) && 'col-span-2',
              )}>
              <h3 className="relative left-7 top-6 text-4xl font-bold">
                {category.name}
              </h3>
              <Image
                src={category.imageUrl}
                width={200}
                height={200}
                alt="category image"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BrowseByCategory
