import { Skeleton } from '@ecom/ui'
import { classMerge } from '@ecom/ui/lib/utils'

interface CategoryCardSkeletonProps {
  className?: string
}

const CategoryCardSkeleton = ({ className }: CategoryCardSkeletonProps) => {
  return (
    <Skeleton.Root
      className={classMerge(
        'xs:h-[200px] h-[180px] rounded-[20px] bg-white',
        className,
      )}>
      {/* Content area */}
      <div className="px-4 py-5 2xl:px-7 2xl:py-6">
        <Skeleton.Title className="h-8 w-24 2xl:h-10" />
      </div>

      {/* Image area */}
      <div className="absolute right-0 h-[300px] w-[50%] overflow-hidden">
        <Skeleton.Image className="h-full w-full" />
      </div>
    </Skeleton.Root>
  )
}

export default CategoryCardSkeleton
