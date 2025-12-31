import MainLayout from "@/components/layout/main-layout"
import HeroCarousel from "@/components/hero-carousel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  GraduationCap, 
  Users, 
  Award, 
  Heart,
  Target,
  Eye,
  ArrowRight,
  CheckCircle,
  Calendar,
  MapPin,
  Phone,
  BookOpen,
  Microscope,
  Stethoscope
} from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "About MOCHAM | Homeopathy School History & Mission | Uyo Nigeria",
  description: "Learn about MOCHAM - Nigeria's first homeopathy school since 1982. Discover our mission, vision, founder Dr. Effiong Udo Umoren, and our commitment to excellence in alternative medicine education in Uyo, Akwa Ibom State.",
  keywords: [
    'MOCHAM history',
    'homeopathy school Nigeria',
    'alternative medicine institution',
    'medical college Uyo',
    'Dr. Effiong Udo Umoren',
    'homeopathy education Nigeria'
  ],
  openGraph: {
    title: 'About MOCHAM - Nigeria\'s Premier Homeopathy School Since 1982',
    description: 'Learn about MOCHAM\'s mission, vision, and commitment to excellence in alternative medicine education. Discover our heritage in Uyo, Akwa Ibom State.',
    url: 'https://www.mocham.org/about-us',
  }
}

export default function AboutUsPage() {
  const heroImages = [
    '/aerial.jpg',
    '/abs.jpg', 
    '/tippi-mackenzie-homepage-banner-updated.jpeg'
  ]

  return (
    <MainLayout>
      {/* Hero Section with Carousel */}
      <HeroCarousel
        images={heroImages}
        title="About MOCHAM"
        subtitle="Nigeria's Premier Alternative Medicine Education Institution"
        description="Established in 1982 by Dr. Effiong Udo Umoren, we are the first and leading institution dedicated to homeopathic and alternative medicine education in Nigeria."
      />

      {/* Mission, Vision, Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-medical-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our mission is to produce Homoeopathic and other alternative medical doctors with a repertoire of technical, analytical, diagnostic, scientific, medical and pharmaceutical knowledge capable of withstanding challenges in the emerging trend in the medical profession, equally to train persons who will be highly competent, ethically and professionally sound, who will pass through the rigors of academic exactitude.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-healing-green rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  Homoeopathy is a branch of scientific medicine which necessitates a competent knowledge of all other subjects including in the term MEDICINE Anatomy, physiology, pathology, Bacteriology, Biochemistry, genetics psychiatry and clinical Diagnosis. Homeopathy is a form of prescribable treatment for various acute and chronic disease conditions using extracts of naturally occurring material chosen and prepared in drops, suspension, tinctures, triturates, tablet, globules, capsules, caplets, injection solution, ointment, oils, cream, ear drops and eye drops etc. for the individual is in a way that, is unique in medicine.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-calming-teal rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
                <ul className="text-gray-600 space-y-2 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Excellence in Education
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Compassionate Care
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Evidence-Based Practice
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Community Service
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Heritage & Legacy
              </h2>
              <div className="space-y-6 text-gray-600">
                <p className="text-lg leading-relaxed">
                  Founded in 1982 by Dr. Effiong Udo Umoren, the father of homeopathy in Nigeria, our institution began as the Cottage Homoeopathic Medical College and Hospital with a mission to provide comprehensive education in classical and modern homeopathy.
                </p>
                <p className="leading-relaxed">
                  Dr. Umoren was the first practitioner of homeopathic medicine in Nigeria, starting his practice in 1940. He established the first Association of Nigerian Homeopathic and Natural Therapeutics in 1965, laying the foundation for organized homeopathic practice in the country.
                </p>
                <p className="leading-relaxed">
                  Today, we continue his legacy as the Modern College of Homoeopathy/Alternative Medicine (MOCHAM), producing eminent practitioners who serve communities across Nigeria and neighboring countries.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-medical-blue">1982</div>
                  <div className="text-gray-600">Founded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-healing-green">40+</div>
                  <div className="text-gray-600">Years of Excellence</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-medical-blue rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">1982</h4>
                      <p className="text-gray-600">Cottage Homoeopathic Medical College and Hospital established</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-healing-green rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">2007</h4>
                      <p className="text-gray-600">Curriculum modernization and international recognition</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-calming-teal rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">1965</h4>
                      <p className="text-gray-600">First Nigerian Homeopathic Association founded</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-warm-orange rounded-lg flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">1940</h4>
                      <p className="text-gray-600">Dr. Umoren began first homeopathic practice in Nigeria</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder & Legacy */}
      {/* <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Founder & Legacy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Honoring the visionary who established homeopathic medicine in Nigeria and the institution that continues his legacy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/dre2.png" 
                    alt="Dr. Effiong Udo Umoren" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Effiong Udo Umoren</h3>
                <p className="text-medical-blue font-semibold mb-4">Founder & Father of Homeopathy in Nigeria</p>
                <p className="text-gray-600 text-sm">
                  Born 1901, first practitioner of homeopathic medicine in Nigeria (1940), established the first Nigerian Homeopathic Association in 1965, founded MOCHAM in 1982.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <img 
                    src="/handshake.png" 
                    alt="Dr. Sarah Adebayo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Sarah Adebayo</h3>
                <p className="text-healing-green font-semibold mb-4">Chief Medical Officer</p>
                <p className="text-gray-600 text-sm">
                  MD, Homeopathy (Germany), with 25+ years of international experience in alternative medicine practice and education.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <img 
                    src="/dr.png" 
                    alt="Dr. Fatima Ibrahim" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Fatima Ibrahim</h3>
                <p className="text-calming-teal font-semibold mb-4">Herbal Medicine Specialist</p>
                <p className="text-gray-600 text-sm">
                  MD, Herbal Medicine (India), with expertise in traditional Nigerian herbs and their therapeutic applications.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      
      {/* Campus & Facilities */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Campus & Facilities
              </h2>
                <p className="text-xl text-gray-600 mb-8">
                The school is situated in a quiet and secluded part of Uyo capital city, 11 homoeopathic crescent by 152 Aka Road Uyo behind the Popular Uyo Township Stadium. A few kilometers from state police command, Ikot Akpanabia. It is a beautiful strategic area, a citadel of learning and academy of science and research.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-medical-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <Microscope className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Research Laboratories</h3>
                    <p className="text-gray-600">
                      Well-equipped anatomy, physiology, pathology, pharmacy, physics, and chemistry laboratories for practical training.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-healing-green rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Museums & Educational Resources</h3>
                    <p className="text-gray-600">
                      Museums of Anatomy, Pathology, and Pharmacology with modern charts and specimens for demonstration.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-calming-teal rounded-lg flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Teaching Hospital</h3>
                    <p className="text-gray-600">
                      Integrated clinic serving the community while providing hands-on clinical training for students.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-warm-orange rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Research Center</h3>
                    <p className="text-gray-600">
                      Dedicated research facility for advancing homeopathic and alternative medicine knowledge.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Campus</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">11 Homoeopathic Crescent, 152 Aka Road, Uyo</p>
                    <p className="text-gray-600">Behind the Popular Uyo Township Stadium, Akwa Ibom State</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600">08037935596</p>
                    <p className="text-gray-600">07088418182</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-600">Previous appointment essential (minimum 48hrs notice)</p>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/contact-us">
                  <Button size="lg" className="w-full bg-medical-blue hover:bg-blue-800">
                    Schedule a Campus Tour
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              MOCHAM Policy
            </h2>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our policy is based on the axiom, Truism and maxim that: <strong>"He who Has knowledge of the healing art and keeps that knowledge to himself is committing a sin against God and mankind"</strong>.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  MOCHAM is an institution dedicated to providing suitable Study courses to those interested in the various aspects of adult teaching, mostly in Homoeopathy and other alternative medicine. In fulfilling this purpose, it is the accepted responsibility of the school to offer the best possible educational programmes, and to revise these whenever possible.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  The institution is the best in the country with a standard curriculum to offer this novel training approach to students in Homoeopathy and other forms of alternative medical sciences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Aims and Objectives */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Aims and Objectives
            </h2>
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-ucsf-blue rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">1</div>
                    <p className="text-gray-600 leading-relaxed">
                      To produce Homoeopath and other Alternative medical Doctors with a repertoire of technical, Analytical, Diagnostic, Scientific, medical and pharmaceutical knowledge capable of withstanding challenges in the emerging trend in the medical profession.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-ucsf-blue rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">2</div>
                    <p className="text-gray-600 leading-relaxed">
                      To produce pharmaceutical scientists, chemist and druggists in Alternative medicine who shall be able to manufacture hygienic highly potent and efficacious herbal medications, Homoeopathic remedies, Naturopathic supplements etc. that shall meet both NAFDAC specification and international standard.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-ucsf-blue rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">3</div>
                    <p className="text-gray-600 leading-relaxed">
                      To award certificate, Diploma, degree to highly competent, ethically and professionally sound persons who have passed through the rigors of academic exactitude.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-ucsf-blue rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">4</div>
                    <p className="text-gray-600 leading-relaxed">
                      To assist in the scientific evaluation of medical claims by practitioners of traditional medicine by promoting research and clinical trials on this model.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-ucsf-blue rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">5</div>
                    <p className="text-gray-600 leading-relaxed">
                      As the march towards the integration of Alternative medicine into the nation's health care system progresses, the college wishes to produce properly trained Alternative medical practitioners at both the sub-professional level, medical assistants, and Doctors respectively in our primary and tertiary health institutions. The Doctors can be using appropriate medicaments manufactured from locally or readily available materials effect rational cure as well as compliment the effort of conventional medicine.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-ucsf-blue rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">6</div>
                    <p className="text-gray-600 leading-relaxed">
                      Apart from the medical assistants and the professionals, the college offers training in General Nursing and midwifery with particular reference to the use of Alternative drugs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Board of Directors/Regents
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Chief Medical Director/Founder</h3>
                  <p className="text-medical-blue font-semibold mb-2">Dr. E. U. Umoren</p>
                  <p className="text-sm text-gray-600">
                    MD, D.H.M., N.D., D.SC., D. B.M., Ph.D (LOND).; FSCU., F.I.A.Sc. Past founder and Grand Patron ANHMA
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Dean/Provost</h3>
                  <p className="text-medical-blue font-semibold mb-2">Dr. Edem E. Umoren</p>
                  <p className="text-sm text-gray-600">
                    DH.MS., EHM., Bsc [Uniuyo] M.I.H.M.F. (INDIA)., M.A.N.H.M.A
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Patron/Director of Disciplinary and Ethics</h3>
                  <h4 className="text-gray-700 font-semibold mb-2">Chairman Governing Council</h4>
                  <p className="text-medical-blue font-semibold mb-2">Dr. B.A. UDOFIA., (JP)</p>
                  <p className="text-sm text-gray-600">
                    D.H.M, N.D., D.SC. (LOND)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Director of Finance</h3>
                  <p className="text-medical-blue font-semibold mb-2">Mrs. MARIA PATRICK UMOH</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Director of Publicity</h3>
                  <p className="text-medical-blue font-semibold mb-2">Dr. Micheal Ekwere</p>
                  <p className="text-sm text-gray-600">
                    Dsc. ND
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Director of Research and Strategy</h3>
                  <p className="text-medical-blue font-semibold mb-2">DR. Linus Inyang</p>
                  <p className="text-sm text-gray-600">
                    D.H.M.S., M.A.N.H.N.A
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Director of Academic Affairs</h3>
                  <p className="text-medical-blue font-semibold mb-2">Prof. Lawrence Usip</p>
                  <p className="text-sm text-gray-600">
                    (Uniport)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Director of Alternative Nursing and Midwifery Affairs</h3>
                  <p className="text-medical-blue font-semibold mb-2">Abigail Okon Eyo</p>
                  <p className="text-sm text-gray-600">
                    SRN
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
 
    </MainLayout>
  )
}