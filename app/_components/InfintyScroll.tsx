"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Product {
  id: number
  name: string
  price: number
  description: string
}

interface InfiniteScrollProps {
  loadMore: (page: number) => Promise<Product[]>
  direction: 'up' | 'down'
  threshold?: number
  height: number | string
  initialItems?: Product[]
  renderItem: (item: Product, index: number) => React.ReactNode
}

export function InfiniteScroll({
  loadMore,
  direction,
  threshold = 0.8,
  height,
  renderItem,
  initialItems = []
}: InfiniteScrollProps) {
  const [items, setItems] = useState<Product[]>(initialItems)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const newItems = await loadMore(page)
      if (newItems.length === 0) {
        setHasMore(false)
      } else {
        setItems(prevItems => direction === 'down' ? [...prevItems, ...newItems] : [...newItems, ...prevItems])
        setPage(prevPage => prevPage + 1)
      }
    } catch (error) {
      console.error('Error loading more items:', error)
    } finally {
      setLoading(false)
    }
  }, [direction, hasMore, loadMore, loading, page])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: threshold
    }

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      const target = entries[0]
      if (target.isIntersecting) {
        loadMoreItems()
      }
    }

    observerRef.current = new IntersectionObserver(handleIntersect, options)

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold, loadMoreItems])

  useEffect(() => {
    if (direction === 'up' && containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current
      containerRef.current.scrollTop = scrollHeight - clientHeight
    }
  }, [items, direction])

  return (
    <ScrollArea 
      className={`overflow-y-auto ${direction === 'up' ? 'flex flex-col-reverse' : ''}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      ref={containerRef}
    >
      {direction === 'up' && loading && (
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      <div className="flex flex-col justify-start items-stretch gap-4 p-4">
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {renderItem(item, index)}
          </React.Fragment>
        ))}
      </div>
      {direction === 'down' && loading && (
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
    </ScrollArea>
  )
}

