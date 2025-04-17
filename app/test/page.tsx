"use client"
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Product Catalog</h1>
        <ProductList />
      </div>
    </main>
  )
}


import { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Product {
  id: number
  name: string
  price: number
  description: string
}

const generateMockProducts = (start: number, count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i,
    name: `Product ${start + i}`,
    price: Math.round(Math.random() * 100 + 10),
    description: `This is a description for Product ${start + i}. It's a great product with many features.`
  }))
}

 function ProductList() {
  const [items, setItems] = useState<Product[]>([])
  const [hasMore, setHasMore] = useState(true)

  const fetchMoreData = () => {
    if (items.length >= 100) {
      setHasMore(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setItems(items.concat(generateMockProducts(items.length + 1, 10)))
    }, 500)
  }

  useEffect(() => {
    // Initial load
    fetchMoreData()
  }, [])

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4 className="text-center py-4">Loading...</h4>}
      endMessage={
        <p className="text-center py-4">
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {items.map((item) => (
          <Card key={item.id} className="w-full">
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>${item.price.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{item.description}</p>
            </CardContent>
            <CardFooter>
              <Button>Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </InfiniteScroll>
  )
}


