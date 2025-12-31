'use client'

import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Image as ImageIcon,
  Filter,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

interface GalleryItem {
  id: string
  title: string
  description?: string
  imageUrl: string
  category: string
  isFeatured: boolean
  order: number
}

const categories = ['All', 'Campus', 'Events', 'Students', 'Faculty', 'General']

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch('/api/gallery')
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
          throw new Error(errorData.error || errorData.details || 'Failed to fetch gallery')
        }
        const data = await res.json()
        setGallery(data)
        setFilteredGallery(data)
      } catch (error) {
        console.error('Error fetching gallery:', error)
        // Set empty array on error to prevent UI issues
        setGallery([])
        setFilteredGallery([])
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredGallery(gallery)
    } else {
      setFilteredGallery(gallery.filter(item => item.category === selectedCategory))
    }
  }, [selectedCategory, gallery])

  const openLightbox = (item: GalleryItem) => {
    setSelectedImage(item)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return
    
    const currentIndex = filteredGallery.findIndex(item => item.id === selectedImage.id)
    let newIndex: number
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredGallery.length
    } else {
      newIndex = (currentIndex - 1 + filteredGallery.length) % filteredGallery.length
    }
    
    setSelectedImage(filteredGallery[newIndex])
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return
      
      if (e.key === 'Escape') {
        closeLightbox()
      } else if (e.key === 'ArrowRight') {
        navigateImage('next')
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, filteredGallery])

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-br from-ucsf-blue to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                Gallery
              </h1>
              <p className="text-lg md:text-2xl text-blue-100 leading-relaxed drop-shadow-md">
                Explore our campus, events, students, and faculty through our photo collection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-ucsf-blue text-white"
                      : ""
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
              {filteredGallery.length} image{filteredGallery.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-ucsf-blue"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading gallery...</p>
            </div>
          ) : filteredGallery.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                {gallery.length === 0 
                  ? 'No images available in the gallery'
                  : 'No images found in this category'}
              </p>
              {gallery.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Please check your database connection or run the gallery population script.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGallery.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => openLightbox(item)}
                >
                  <div className="relative h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 rounded-full p-3">
                          <ImageIcon className="h-6 w-6 text-ucsf-blue" />
                        </div>
                      </div>
                    </div>
                    {item.isFeatured && (
                      <div className="absolute top-2 right-2 bg-ucsf-blue text-white text-xs px-2 py-1 rounded">
                        Featured
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <span className="inline-block mt-2 text-xs text-ucsf-blue bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-6xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            {filteredGallery.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage('prev')
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage('next')
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative w-full h-[80vh] bg-gray-900 rounded-lg overflow-hidden">
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>

            {/* Image Info */}
            <div className="mt-4 text-white text-center">
              <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-gray-300 mb-2">{selectedImage.description}</p>
              )}
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <span>{selectedImage.category}</span>
                {selectedImage.isFeatured && (
                  <span className="bg-ucsf-blue px-2 py-1 rounded">Featured</span>
                )}
                <span>
                  {filteredGallery.findIndex(item => item.id === selectedImage.id) + 1} / {filteredGallery.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

