import { Skeleton } from '@ecom/ui'

interface CustomerReviewCardSkeletonProps {
  className?: string
}

const CustomerReviewCardSkeleton = ({
  className,
}: CustomerReviewCardSkeletonProps) => {
  return (
    <Skeleton.Root
      className={`rounded-[20px] border border-gray-200 bg-white px-9 py-6 shadow-sm ${className}`}>
      {/* Rating skeleton */}
      <div className="mb-4">
        <Skeleton.Title className="h-5 w-20" />
      </div>

      {/* Name and verification skeleton */}
      <div className="mb-2 flex items-center gap-2">
        <Skeleton.Title className="h-6 w-24" />
        <Skeleton.Title className="h-5 w-5 rounded-full" />
      </div>

      {/* Review text skeleton */}
      <div className="space-y-2">
        <Skeleton.Title className="h-4 w-full" />
        <Skeleton.Title className="h-4 w-full" />
        <Skeleton.Title className="h-4 w-3/4" />
        <Skeleton.Title className="h-4 w-1/2" />
      </div>
    </Skeleton.Root>
  )
}

export default CustomerReviewCardSkeleton
