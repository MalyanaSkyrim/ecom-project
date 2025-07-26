import FeaturedProducts from '@/components/FeaturedProducts'

const products = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    rating: 4.3,
    price: 8999, // $89.99
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    rating: 4.7,
    price: 24999, // $249.99
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center',
  },
  {
    id: 3,
    name: 'Portable Coffee Maker',
    rating: 3.9,
    price: 12995, // $129.95
    imageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&crop=center',
  },
  {
    id: 4,
    name: 'Ergonomic Gaming Chair',
    rating: 4.5,
    price: 34900, // $349.00
    imageUrl:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
  },
]

const NewArrivals = () => {
  return (
    <FeaturedProducts
      title="New Arrivals"
      products={products}
      viewAllPath="/products/new-arrivals"
    />
  )
}

export default NewArrivals
