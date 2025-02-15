import MapLayout from "@/components/map-layout"
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <MapLayout />
      <Link 
        href="/report" 
        className="fixed bottom-8 right-8 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        Report Incident
      </Link>
    </div>
  );
}
