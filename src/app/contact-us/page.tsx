"use client"

import MainLayout from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  Calendar,
  Download,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ExternalLink,
  Navigation,
  Star,
  Award,
  Users,
  Stethoscope,
  ArrowRight
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const faqs = [
    {
      question: "What are the admission requirements for your programs?",
      answer: "For our medical degree program, you need a secondary school certificate with credits in Biology, Chemistry, Physics, Mathematics, and English. For diploma programs, a secondary school certificate is sufficient. We also conduct entrance examinations and interviews."
    },
    {
      question: "Are your programs accredited by the Nigerian government?",
      answer: "Yes, our medical degree program is accredited by the National Universities Commission (NUC). Our diploma programs are recognized by relevant professional bodies in Nigeria."
    },
    {
      question: "Can I practice medicine after graduating from your school?",
      answer: "Graduates of our medical degree program can practice as licensed medical doctors specializing in alternative and integrative medicine. Our graduates work in hospitals, clinics, and private practice."
    },
    {
      question: "Do you offer financial aid or scholarships?",
      answer: "No, we dont offer various scholarship programs and financial aid options for qualified students. Contact our admissions office for detailed information about available funding opportunities."
    },
    {
      question: "Can I book an appointment at your clinic even if I'm not a student?",
      answer: "Absolutely! Our clinic is open to the public and provides alternative medicine services to anyone seeking natural healing approaches. Students receive discounted rates for consultations."
    }
  ]

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-ucsf-blue via-blue-700 to-medical-green"></div>
        <div className="absolute inset-0 bg-[url('/tippi-mackenzie-homepage-banner-updated.jpg')] bg-cover bg-center opacity-20"></div>
        
        <div className="relative container mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Contact Us
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Get in touch with Nigeria's premier medical and homeopathy school. We're here to help you start your journey in alternative medicine.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        
            {/* Email Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white dark:bg-gray-900">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-medical-green rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Email</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                  Send us an email and we'll respond within 24 hours.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold text-medical-green text-sm sm:text-base break-all">info@medicalhomeopathyschool.edu.ng</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">General Inquiries</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">
                Send Us a Message
              </h2>
              
              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                  <p className="text-green-800 dark:text-green-200 text-sm sm:text-base">
                    Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0" />
                  <p className="text-red-800 dark:text-red-200 text-sm sm:text-base">
                    Sorry, there was an error sending your message. Please try again or contact us directly.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ucsf-blue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ucsf-blue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                      placeholder="+234-xxx-xxx-xxxx"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ucsf-blue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ucsf-blue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="admissions">Admissions Inquiry</option>
                    <option value="clinic">Clinic Appointment</option>
                    <option value="programs">Program Information</option>
                    <option value="campus-tour">Campus Tour</option>
                    <option value="general">General Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ucsf-blue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors resize-vertical"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting}
                  className="w-full bg-ucsf-blue hover:bg-blue-800 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Admission & Courses Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ucsf-blue dark:text-blue-400 mb-4 sm:mb-6">
                Join the Future of Integrative Healthcare
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-dim-blue-600 dark:text-gray-300 max-w-3xl mx-auto">
                At Modern College of Homoeopathy, we blend decades of tradition with modern clinical practice. Our curriculum is designed to qualify you for a global career in alternative and complementary medicine.
              </p>
            </div>

            {/* Why Choose Modern College */}
            <div className="mb-16">
              <h3 className="text-2xl sm:text-3xl font-bold text-dim-blue-800 dark:text-white mb-8 text-center">
                Why Choose Modern College?
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-ucsf-blue rounded-lg flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold text-dim-blue-800 dark:text-white mb-2">Legacy</h4>
                    <p className="text-sm text-dim-blue-600 dark:text-gray-400">Training world-class practitioners since 1957.</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-medical-green rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold text-dim-blue-800 dark:text-white mb-2">Expert Faculty</h4>
                    <p className="text-sm text-dim-blue-600 dark:text-gray-400">Learn from seasoned lecturers (Ph.D., M.Sc.) and visiting professors.</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-accent-orange rounded-lg flex items-center justify-center mb-4">
                      <Stethoscope className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold text-dim-blue-800 dark:text-white mb-2">Clinical Experience</h4>
                    <p className="text-sm text-dim-blue-600 dark:text-gray-400">Practical training at our modern Teaching Hospital facility.</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold text-dim-blue-800 dark:text-white mb-2">Global Reach</h4>
                    <p className="text-sm text-dim-blue-600 dark:text-gray-400">Gain the skills to practice in Nigeria and internationally.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Academic Programs */}
            <div className="mb-16">
              <h3 className="text-2xl sm:text-3xl font-bold text-dim-blue-800 dark:text-white mb-8 text-center">
                Our Academic Programs
              </h3>
              <p className="text-center text-dim-blue-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                We offer Certificate, Diploma, Bachelor, and Master Degrees across several specialized fields:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-white dark:bg-gray-900">
                  <h4 className="font-bold text-ucsf-blue dark:text-blue-400 mb-3">5-Year Medical Programs</h4>
                  <ul className="space-y-1 text-sm text-dim-blue-600 dark:text-gray-400">
                    <li>• Homoeopathic Medical Science</li>
                    <li>• Clinical Nutrition & Dietetics</li>
                    <li>• Homoeopathic Pharmacy</li>
                    <li>• Electro-Homoeopathy</li>
                    <li>• Chiropractic Medicine</li>
                    <li>• Osteopathy</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-white dark:bg-gray-900">
                  <h4 className="font-bold text-ucsf-blue dark:text-blue-400 mb-3">4-Year Professional Programs</h4>
                  <ul className="space-y-1 text-sm text-dim-blue-600 dark:text-gray-400">
                    <li>• Acupuncture</li>
                    <li>• Veterinary Homoeopathy</li>
                    <li>• Professional Nursing & Midwifery</li>
                    <li>• Naturopathic Science</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-white dark:bg-gray-900">
                  <h4 className="font-bold text-ucsf-blue dark:text-blue-400 mb-3">2 & 3-Year Programs</h4>
                  <ul className="space-y-1 text-sm text-dim-blue-600 dark:text-gray-400">
                    <li>• Herbology / Botany (3 yrs)</li>
                    <li>• Natural Medicine (3 yrs)</li>
                    <li>• Therapeutic Massage (2 yrs)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Admission Requirements */}
            <div className="mb-16">
              <h3 className="text-2xl sm:text-3xl font-bold text-dim-blue-800 dark:text-white mb-8 text-center">
                Admission Requirements
              </h3>
              <p className="text-center text-dim-blue-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                To maintain our high standards of excellence, applicants must meet the following criteria:
              </p>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Card className="border-l-4 border-ucsf-blue bg-white dark:bg-gray-900">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-dim-blue-800 dark:text-white mb-2">Fresh Students</h4>
                    <p className="text-sm text-dim-blue-600 dark:text-gray-400">Minimum of five (5) O&apos; Level credits in Biology, English, Chemistry, Physics, and Mathematics.</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-medical-green bg-white dark:bg-gray-900">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-dim-blue-800 dark:text-white mb-2">Direct Entry</h4>
                    <p className="text-sm text-dim-blue-600 dark:text-gray-400">We welcome holders of OND, HND, B.Sc., or M.Sc. looking to specialize in Alternative Medicine.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* How to Apply */}
            <div className="mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-dim-blue-800 dark:text-white mb-8 text-center">
                How to Apply
              </h3>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center flex-wrap">
                <Link href="/contact-us" className="flex items-center gap-3 text-dim-blue-600 dark:text-gray-300 hover:text-ucsf-blue dark:hover:text-blue-400 transition-colors">
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span><strong>Visit our Campus:</strong> 11 Homoeopathic Crescent by 152 Aka Road, Uyo.</span>
                </Link>
                <a href="tel:08037935596" className="flex items-center gap-3 text-dim-blue-600 dark:text-gray-300 hover:text-ucsf-blue dark:hover:text-blue-400 transition-colors">
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span><strong>Call Admissions:</strong> 08037935596 or 09077124866</span>
                </a>
                <Link href="/contact-us" className="flex items-center gap-3 text-dim-blue-600 dark:text-gray-300 hover:text-ucsf-blue dark:hover:text-blue-400 transition-colors">
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span><strong>Online:</strong> Apply via our Contact page</span>
                </Link>
              </div>
              <p className="text-center text-sm text-dim-blue-600 dark:text-gray-400 mt-8 italic">
                Note: Our &quot;Teaching Hospital&quot; is equipped with modern facilities to ensure students receive practical clinical enlightenment during their study.
              </p>
            </div>

            <div className="text-center">
              <Link href="/contact-us">
                <Button size="lg" variant="medical" className="font-semibold">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find answers to common questions about our programs, admissions, and clinic services.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white dark:bg-gray-900 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-4 sm:p-6 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                        openFAQ === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFAQ === index && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-base sm:text-lg">
              Still have questions? We're here to help!
            </p>
            <Button size="lg" className="bg-ucsf-blue hover:bg-blue-800 text-white font-semibold px-8 py-3">
              <MessageSquare className="mr-2 h-5 w-5" />
              Ask a Question
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}