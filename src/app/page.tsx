import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, AlertTriangle, Camera, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-8 lg:px-12 h-16 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <span className="ml-2 text-2xl font-bold">
            <span className="relative">
              lmk
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 transform -rotate-2"></span>
            </span>
          </span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-gray-100">
            </div>
          </div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-6 text-center backdrop-blur-sm bg-white/70 p-8 rounded-xl">
              <div className="space-y-4">
                <h1 className="text-3xl text-black font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Spot Hazards, Save Lives: {" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">Just lmk</span>
                    <span className="absolute bottom-1 left-0 w-full h-[6px] bg-red-600/80 transform -rotate-2 z-0"></span>
                  </span>
                </h1>
                <p className="mx-auto max-w-[800px] text-gray-700 md:text-2xl">
                  Use AI to report and map urban hazards in real-time. Make your city safer for everyone.
                </p>
              </div>
              <div className="flex gap-4">
                <Link href="/map">
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-700">Key Features</h2>
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-red-600">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white mb-4">
              Join the Safety Revolution
            </h2>
            <p className="mx-auto max-w-[600px] text-white/90 md:text-xl mb-8">
              Be part of making your city safer. Sign up for early access and help shape the future of urban safety.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
             <Link href="/map">
                <Button className="bg-white text-red-600 hover:bg-gray-100 text-lg font-bold px-12 py-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-white/20 backdrop-blur-sm">
                  Get Started Now
                </Button>
             </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center px-8 md:px-12 border-t">
        <p className="text-xs text-gray-500 text-center">© 2025 lmk. All rights reserved.</p>
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
    <div className="flex flex-col items-center text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
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
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}

interface BeneficiaryCardProps {
  title: string;
  description: string;
}

function BeneficiaryCard({ title, description }: BeneficiaryCardProps) {
  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

