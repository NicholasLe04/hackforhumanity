import { AlertTriangle, Info } from "lucide-react"

const MockReport = () => {
  return (
    <div className="bg-white text-black shadow-2xl p-8 max-h-[80vh] overflow-scroll">
      <h2 className="text-2xl font-bold mb-6">Example Location Report</h2>

      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <Info className="w-6 h-6 text-red-500 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">User Details</h3>
            <p className="text-gray-600">Name: John Doe</p>
            <p className="text-gray-600">Email: john@example.com</p>
            <p className="text-gray-600">Generated at : 2024-10-19T12:00:00.000Z</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <Info className="w-6 h-6 text-blue-500 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">Location Details</h3>
            <p className="text-gray-600">Latitude: 37.7749° N, Longitude: 122.4194° W</p>
            <p className="text-gray-600">Address: San Francisco, CA, USA</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">Incidents in the Area</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>3 reported thefts in the last 30 days</li>
              <li>1 case of vandalism reported last week</li>
              <li>2 noise complaints in the past month</li>
            </ul>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <Info className="w-6 h-6 text-green-500 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">Safety Score</h3>
            <p className="text-gray-600">7.5/10 - Generally safe area with moderate incident rate</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <Info className="w-6 h-6 text-purple-500 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">Recommendations</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Stay aware of your surroundings, especially at night</li>
              <li>Keep valuables out of sight in vehicles</li>
              <li>Report any suspicious activity to local authorities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MockReport
