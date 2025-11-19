import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left - Copyright */}
          <div className="text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Placement Preparation Portal. All rights reserved.</p>
          </div>

          {/* Right - Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              About
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer