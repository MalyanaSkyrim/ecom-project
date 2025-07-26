import ProductCard from '@/components/ProductCard'
import { useRouter } from 'next/navigation'

import { useWindowSize } from '@ecom/ui/hooks'
import { Button, Carousel } from '@ecom/ui/index'

interface Product {
  id: number
  name: string
  rating: number
  price: number
  imageUrl: string
}

interface FeaturedProductsProps {
  products: Product[]
  title: string
  viewAllPath: string
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  title,
  viewAllPath,
}) => {
  const { width } = useWindowSize()
  const isMobile = width < 640
  const router = useRouter()

  const handleViewAllClick = () => {
    router.push(viewAllPath)
  }

  return (
    <div className="section_container xs:space-y-14 space-y-10">
      <h1 className="section_title">{title}</h1>
      <div className="xs:space-y-10 space-y-6">
        {isMobile ? (
          <div className="xs:w-[calc(100vw-40px)] mx-auto w-[calc(100vw-32px)] overflow-hidden">
            <Carousel
              slidesPerView={2}
              navigation={false}
              pagination={false}
              className="mx-auto flex w-[120vw] items-center"
              components={products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            />
          </div>
        ) : (
          <div className="mx-auto grid w-full grid-cols-2 gap-x-5 gap-y-7 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}

        <Button
          variant="outline"
          className="xs:w-44 mx-auto flex h-12 w-full rounded-full text-base"
          onClick={handleViewAllClick}>
          View all
        </Button>
      </div>
    </div>
  )
}

export default FeaturedProducts
