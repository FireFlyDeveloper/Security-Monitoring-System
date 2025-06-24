'use client';
import { motion } from "framer-motion";
import Image from "next/image";
import "./globals.css";

export default function Home() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  const hoverEffect = {
    scale: 1.05,
    boxShadow: "0px 5px 15px rgba(0,0,0,0.3)"
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-950 text-gray-100"
    >
      {/* University Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-[#b30000] py-3 px-6 shadow-md"
      >
        <div className="max-w-6xl mx-auto flex items-center">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Image 
              src="/batstateu-logo.png" 
              alt="Batangas State University Logo" 
              className="h-12 mr-4"
              width={55}
              height={50}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <h2 className="font-bold text-white">Batangas State University</h2>
            <p className="text-sm text-red-100">Laptop Position Monitoring System</p>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <motion.div 
          className="grid md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column - Content */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <div className="space-y-4">
              <motion.span 
                className="inline-block px-3 py-1 bg-red-900 text-red-300 rounded-full text-sm font-medium"
                whileHover={{ scale: 1.05 }}
              >
                LAB SECURITY SOLUTION
              </motion.span>
              <motion.h1 
                className="text-4xl font-bold tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Automated Laptop <span className="text-red-400">Position Monitoring</span>
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Eliminate manual CCTV checks with our real-time tracking system for public laptops in the Internet Laboratory.
              </motion.p>
            </div>

            {/* Key Features */}
            <motion.div className="grid grid-cols-2 gap-4" variants={containerVariants}>
              {[
                { title: "Real-time Alerts", desc: "Instant notifications when laptops are moved", color: "border-red-500", textColor: "text-red-300" },
                { title: "Movement Logs", desc: "Complete history with timestamps", color: "border-green-500", textColor: "text-green-300" },
                { title: "Admin Dashboard", desc: "Centralized monitoring interface", color: "border-purple-500", textColor: "text-purple-300" },
                { title: "Theft Prevention", desc: "Deter unauthorized removal", color: "border-amber-500", textColor: "text-amber-300" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className={`bg-gray-800 p-4 rounded-lg border-l-4 ${feature.color}`}
                  variants={itemVariants}
                  whileHover={hoverEffect}
                >
                  <h3 className={`font-medium ${feature.textColor}`}>{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div className="flex flex-col sm:flex-row gap-4 pt-4" variants={itemVariants}>
              <motion.a 
                href="/login" 
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium flex items-center justify-center"
                whileHover={{ scale: 1.05, backgroundColor: "#b30000" }}
                whileTap={{ scale: 0.95 }}
              >
                Access Admin Dashboard
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </motion.a>
              <motion.a 
                href="#how-it-works" 
                className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium flex items-center justify-center border border-gray-700"
                whileHover={{ scale: 1.05, backgroundColor: "#1f2937" }}
                whileTap={{ scale: 0.95 }}
              >
                How It Works
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Security Display */}
          <motion.div 
            className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-lg"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative h-80 flex items-center justify-center">
              {/* Laptop visualization with security check */}
              <div className="relative w-full max-w-md">
                {/* Laptop base */}
                <motion.div 
                  className="mx-auto w-3/4 bg-gray-800 rounded-lg rounded-b-none h-40 border-2 border-gray-700 border-b-0 flex items-center justify-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-center p-4">
                    {/* Security status indicator */}
                    <motion.div 
                      className="mx-auto mb-4 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border-4 border-red-500"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </motion.div>
                    <p className="text-lg font-medium text-gray-200">Secured Laptop</p>
                    <p className="text-sm text-gray-400 mt-1">Locked in position</p>
                  </div>
                </motion.div>
                
                {/* Laptop screen */}
                <div className="mx-auto w-full bg-gray-700 rounded-t-lg h-6 border-2 border-gray-700 border-b-0"></div>
                
                {/* Security checklist */}
                <motion.div 
                  className="mt-6 bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Security Checks
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {["System operational", "Position verified", "Alarm system active"].map((item, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-center text-gray-400"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <motion.div 
                  className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full opacity-20"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute top-3/4 right-1/4 w-4 h-4 bg-green-500 rounded-full opacity-20"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div 
                  className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-500 rounded-full opacity-20"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* How It Works Section */}
        <motion.section 
          id="how-it-works" 
          className="py-16 mt-12 border-t border-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2 
            className="text-2xl font-bold text-center mb-12"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            How The System Works
          </motion.h2>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { number: 1, title: "Sensor Installation", desc: "Bluetooth-Low-Energy devices are installed on each laptop in the Internet Lab.", color: "border-red-500", bgColor: "bg-red-900/50", textColor: "text-red-400" },
              { number: 2, title: "Real-time Monitoring", desc: "The system continuously checks each laptop's locked status in real-time.", color: "border-purple-500", bgColor: "bg-purple-900/50", textColor: "text-purple-400" },
              { number: 3, title: "Instant Alerts", desc: "Admins receive immediate notifications when any laptop is moved from its secured position.", color: "border-green-500", bgColor: "bg-green-900/50", textColor: "text-green-400" }
            ].map((step, index) => (
              <motion.div
                key={index}
                className={`bg-gray-900 p-6 rounded-xl border ${step.color} hover:border-opacity-100 transition-colors`}
                variants={itemVariants}
                whileHover={hoverEffect}
              >
                <div className={`w-12 h-12 ${step.bgColor} rounded-full flex items-center justify-center mb-4`}>
                  <span className={`text-xl font-bold ${step.textColor}`}>{step.number}</span>
                </div>
                <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Deployment Info */}
        <motion.div 
          className="mt-12 bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-medium mb-2">Local Deployment</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Currently deployed in the Internet Laboratory at Batangas State University. 
            System designed for easy scaling to additional computer labs.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <motion.span 
              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800 text-sm text-red-400"
              whileHover={{ scale: 1.05 }}
            >
              <motion.svg 
                className="w-3 h-3 mr-1 text-red-500" 
                fill="currentColor" 
                viewBox="0 0 8 8"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <circle cx="4" cy="4" r="3" />
              </motion.svg>
              Active Monitoring
            </motion.span>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        className="bg-gray-900 border-t border-gray-800 py-8 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              className="flex items-center mb-4 md:mb-0"
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Image 
                src="/batstateu-logo.png" 
                alt="Batangas State University Logo" 
                className="h-8 mr-3"
                width={40}
                height={43}
              />
              <span className="text-sm text-gray-400">Laptop Position Monitoring System</span>
            </motion.div>
            <motion.div 
              className="text-sm text-gray-500"
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p>Computer Engineering Department • 2025</p>
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}