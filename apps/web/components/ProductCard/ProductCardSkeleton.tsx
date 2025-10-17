import { Skeleton } from '@ecom/ui'
import { classMerge } from '@ecom/ui/lib/utils'

interface ProductCardSkeletonProps {
  className?: string
  style?: React.CSSProperties
}

const ProductCardSkeleton = ({
  className,
  style,
}: ProductCardSkeletonProps) => {
  return (
    <Skeleton.Root className={classMerge('space-y-4', className)} style={style}>
      {/* Image skeleton */}
      <Skeleton.Image className="aspect-[0.98] w-full rounded-[20px]" />

      {/* Content skeleton */}
      <div className="space-y-2">
        {/* Product name skeleton */}
        <Skeleton.Title className="h-6 w-full" />

        {/* Rating skeleton */}
        <div className="flex items-center space-x-1">
          <Skeleton.Title className="h-4 w-20" />
          <Skeleton.Title className="h-4 w-12" />
        </div>

        {/* Price skeleton */}
        <Skeleton.Title className="h-7 w-24" />
      </div>
    </Skeleton.Root>
  )
}

export default ProductCardSkeleton
