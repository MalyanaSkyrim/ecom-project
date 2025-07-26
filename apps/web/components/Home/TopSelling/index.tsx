import FeaturedProducts from '@/components/FeaturedProducts'

const products = [
  {
    id: 5,
    name: 'Classic Denim Jacket',
    rating: 4.6,
    price: 7999, // $79.99
    imageUrl:
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center',
  },
  {
    id: 6,
    name: 'Premium Cotton T-Shirt',
    rating: 4.8,
    price: 2999, // $29.99
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
  },
  {
    id: 7,
    name: 'Comfortable Joggers',
    rating: 4.4,
    price: 4999, // $49.99
    imageUrl:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center',
  },
  {
    id: 8,
    name: 'Stylish Hoodie',
    rating: 4.7,
    price: 5999, // $59.99
    imageUrl:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center',
  },
]

const TopSelling = () => {
  return (
    <FeaturedProducts
      title="Top Selling"
      products={products}
      viewAllPath="/products/top-selling"
    />
  )
}

export default TopSelling
