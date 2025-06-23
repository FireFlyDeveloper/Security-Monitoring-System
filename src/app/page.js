import Image from "next/image";
import "./globals.css";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* University Header */}
      <header className="bg-[#b30000] py-3 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center">
          <Image 
            src="/batstateu-logo.png" 
            alt="Batangas State University Logo" 
            className="h-12 mr-4"
          />
          <div>
            <h2 className="font-bold text-white">Batangas State University</h2>
            <p className="text-sm text-red-100">Monitoring System</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-red-900 text-red-300 rounded-full text-sm font-medium">
                LAB SECURITY SOLUTION
              </span>
              <h1 className="text-4xl font-bold tracking-tight">
                Automated Laptop <span className="text-red-400">Position Monitoring</span>
              </h1>
              <p className="text-lg text-gray-300">
                Eliminate manual CCTV checks with our real-time tracking system for public laptops in the Internet Laboratory.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-red-500">
                <h3 className="font-medium text-red-300">Real-time Alerts</h3>
                <p className="text-sm text-gray-400">Instant notifications when laptops are moved</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="font-medium text-green-300">Movement Logs</h3>
                <p className="text-sm text-gray-400">Complete history with timestamps</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-purple-500">
                <h3 className="font-medium text-purple-300">Admin Dashboard</h3>
                <p className="text-sm text-gray-400">Centralized monitoring interface</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-amber-500">
                <h3 className="font-medium text-amber-300">Theft Prevention</h3>
                <p className="text-sm text-gray-400">Deter unauthorized removal</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="/login" 
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center justify-center transition-colors"
              >
                Access Admin Dashboard
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="#how-it-works" 
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center justify-center transition-colors border border-gray-700"
              >
                How It Works
              </a>
            </div>
          </div>

          {/* Right Column - Visual Security Display */}
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-lg">
            <div className="relative h-80 flex items-center justify-center">
              {/* Laptop visualization with security check */}
              <div className="relative w-full max-w-md">
                {/* Laptop base */}
                <div className="mx-auto w-3/4 bg-gray-800 rounded-lg rounded-b-none h-40 border-2 border-gray-700 border-b-0 flex items-center justify-center">
                  <div className="text-center p-4">
                    {/* Security status indicator */}
                    <div className="mx-auto mb-4 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border-4 border-red-500 animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-200">Secured Laptop</p>
                    <p className="text-sm text-gray-400 mt-1">Locked in position</p>
                  </div>
                </div>
                
                {/* Laptop screen */}
                <div className="mx-auto w-full bg-gray-700 rounded-t-lg h-6 border-2 border-gray-700 border-b-0"></div>
                
                {/* Security checklist */}
                <div className="mt-6 bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Security Checks
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      System operational
                    </li>
                    <li className="flex items-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Position verified
                    </li>
                    <li className="flex items-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Alarm system active
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full opacity-20"></div>
                <div className="absolute top-3/4 right-1/4 w-4 h-4 bg-green-500 rounded-full opacity-20"></div>
                <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-500 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 mt-12 border-t border-gray-800">
          <h2 className="text-2xl font-bold text-center mb-12">How The System Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-red-500 transition-colors">
              <div className="w-12 h-12 bg-red-900/50 text-red-400 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Sensor Installation</h3>
              <p className="text-gray-400">
                Bluetooth-Low-Energy device are installed on each laptop in the Internet Lab.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-purple-500 transition-colors">
              <div className="w-12 h-12 bg-purple-900/50 text-purple-400 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Real-time Monitoring</h3>
              <p className="text-gray-400">
                The system continuously checks each laptop's locked status in Real-time.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-green-500 transition-colors">
              <div className="w-12 h-12 bg-green-900/50 text-green-400 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Instant Alerts</h3>
              <p className="text-gray-400">
                Admins receive immediate notifications when any laptop is moved from its secured position.
              </p>
            </div>
          </div>
        </section>

        {/* Deployment Info */}
        <div className="mt-12 bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
          <h3 className="text-lg font-medium mb-2">Local Deployment</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Currently deployed in the Internet Laboratory at Batangas State University. 
            System designed for easy scaling to additional computer labs.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800 text-sm text-red-400">
              <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
              Active Monitoring
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Image 
                src="/batstateu-logo.png" 
                alt="Batangas State University Logo" 
                className="h-8 mr-3"
              />
              <span className="text-sm text-gray-400">Monitoring System</span>
            </div>
            <div className="text-sm text-gray-500">
              <p>Computer Engineering Department • 2025</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}