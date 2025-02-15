'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, AlertTriangle, Camera, Zap } from "lucide-react"
import BackgroundMap from "@/components/background-map"

export default function LandingPage() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    const navHeight = 100; // Height of navbar + some padding
    if (section) {
      const sectionTop = section.offsetTop - navHeight;
      window.scrollTo({
        top: sectionTop,
        behavior: "smooth"
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-4 left-0 right-0 px-4 flex items-center justify-center z-[100]">
        <div className="flex items-center justify-between w-full max-w-5xl mx-auto px-6 py-2.5 bg-white/95 backdrop-blur-md border border-gray-200/20 rounded-full shadow-lg">
          <button 
            onClick={scrollToTop}
            className="flex items-center justify-center group"
          >
            <AlertTriangle className="h-6 w-6 text-red-600 group-hover:text-red-700 transition-colors" />
            <span className="ml-2 text-2xl font-bold text-black">
              <span className="relative">
                lmk
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 group-hover:bg-red-700 transform -rotate-2 transition-colors"></span>
              </span>
            </span>
          </button>
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors" 
              onClick={() => scrollToSection('features')}
            >
              Features
            </button>
            <button 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors" 
              onClick={() => scrollToSection('how-it-works')}
            >
              How it Works
            </button>
            <button 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors" 
              onClick={() => scrollToSection('benefits')}
            >
              Benefits
            </button>
            <Link href="/map">
              <Button className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full pt-32 pb-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <BackgroundMap />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/60 via-white/30 to-white">
          </div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-6 max-w-4xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-gray-900">
                  Spot Hazards, Save Lives: {" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">Just lmk</span>
                    <span className="absolute bottom-1 left-0 w-full h-[6px] bg-red-600/80 transform -rotate-2 z-0"></span>
                  </span>
                </h1>
                <p className="mx-auto max-w-[800px] text-gray-700 md:text-2xl font-medium">
                  Use AI to report and map urban hazards in real-time. Make your city safer for everyone.
                </p>
              </div>
              <div className="flex gap-4">
                <Link href="/map">
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                    Get Started
                    <MapPin className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="pt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Real-time Updates
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  AI-Powered
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  Community Driven
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">Key Features</h2>
              <p className="text-gray-500 max-w-[600px] mx-auto">Powerful tools to help make your community safer and more connected.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Camera className="h-10 w-10 text-red-600" />}
                title="AI-Powered Hazard Classification"
                description="Take a photo, and our AI instantly identifies the type of hazard."
              />
              <FeatureCard
                icon={<MapPin className="h-10 w-10 text-red-600" />}
                title="Real-Time Hazard Mapping"
                description="See hazards plotted on an interactive map as they're reported."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-red-600" />}
                title="Instant Alerts"
                description="Receive notifications about nearby hazards to stay safe on the go."
              />
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-700 text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard
                number={1}
                title="Spot a Hazard"
                description="See a pothole, broken streetlight, or any urban hazard? Open the app."
              />
              <StepCard
                number={2}
                title="Snap a Photo"
                description="Take a quick picture of the hazard. Our AI will classify it automatically."
              />
              <StepCard
                number={3}
                title="Share & Alert"
                description="The hazard is instantly mapped and shared with other users and city officials."
              />
            </div>
          </div>
        </section>
        <section id="benefits" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-700 text-center mb-12">Perfect For Everyone.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BeneficiaryCard
                title="Pedestrians & Cyclists"
                description="Navigate safer routes and avoid potential dangers."
              />
              <BeneficiaryCard title="Drivers" description="Receive real-time warnings about road hazards ahead." />
              <BeneficiaryCard
                title="City Governments"
                description="Prioritize maintenance and allocate resources efficiently."
              />
              <BeneficiaryCard
                title="Utility Companies"
                description="Quickly locate and address infrastructure issues."
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-red-600 via-red-500 to-red-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="container mx-auto px-4 md:px-6 text-center relative">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white mb-4">
              Join the Safety Revolution
            </h2>
            <p className="mx-auto max-w-[600px] text-white/90 md:text-xl mb-8">
              Be part of making your city safer. Sign up for early access and help shape the future of urban safety.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/map">
                <Button className="bg-white text-red-600 hover:bg-gray-50 text-lg font-bold px-12 py-6 rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border-2 border-white/20 backdrop-blur-sm">
                  Get Started Now
                  <MapPin className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-white border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-bold">lmk</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Contact</Link>
            </div>
            <p className="text-sm text-gray-500">© 2025 lmk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="mb-4 inline-block p-4 rounded-xl bg-red-50 group-hover:bg-red-100 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="relative p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
        {number}
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

interface BeneficiaryCardProps {
  title: string;
  description: string;
}

function BeneficiaryCard({ title, description }: BeneficiaryCardProps) {
  return (
    <div className="group p-8 rounded-2xl border border-gray-200 bg-white hover:bg-gradient-to-br from-red-50 to-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

