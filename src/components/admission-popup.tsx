'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export default function AdmissionPopUp() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => setIsVisible(false)

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-dim-blue-800 dark:text-white mb-2">
              🎓 Your Journey to Becoming a Medical Professional Starts Here!
            </h2>
            <p className="text-base sm:text-lg font-semibold text-ucsf-blue dark:text-blue-400">
              Join Nigeria&apos;s 1st Institution of Homoeopathy (Est. 1957).
            </p>
          </div>

          <div className="space-y-4 text-dim-blue-600 dark:text-gray-300 text-sm sm:text-base mb-6">
            <p>
              Admission is now <strong className="text-green-600 dark:text-green-400">OPEN</strong> for the 2026 Academic Session. Qualify as a specialist in Alternative Medicine with our 5-year Medical Science programs.
            </p>
            <div className="space-y-1">
              <p><strong>Qualifications:</strong> 5 O&apos; Level Credits (Science) or OND/HND/B.Sc.</p>
              <p><strong>Location:</strong> Uyo, Akwa Ibom State.</p>
            </div>
          </div>

          <Link
            href="/contact-us"
            onClick={handleClose}
            className="block w-full py-4 px-6 text-center font-bold text-white bg-ucsf-blue hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-xl transition-colors uppercase tracking-wide"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  )
}
