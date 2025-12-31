'use client'

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface GalleryItem {
  id: string
  title: string
  description?: string
  imageUrl: string
  category: string
  isFeatured: boolean
  order: number
}

export function GallerySection() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch('/api/gallery?featured=true&limit=6')
        if (!res.ok) throw new Error('Failed to fetch gallery')
        const data = await res.json()
        setGallery(data.slice(0, 6)) // Limit to 6 featured images
      } catch (error) {
        console.error('Error fetching gallery:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-ucsf-blue"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading gallery...</p>
          </div>
        </div>
      </section>
    )
  }

  if (gallery.length === 0) {
    return null
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ucsf-blue dark:text-blue-400 mb-3 sm:mb-4">
              Photo Gallery
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-dim-blue-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore our campus, events, students, and faculty through our photo collection
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
            {gallery.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
              >
                <div className="relative h-48 sm:h-56 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {item.description}
                    </p>
                  )}
                  <span className="inline-block text-xs text-ucsf-blue bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/gallery">
              <Button size="lg" variant="outline">
                View Full Gallery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

