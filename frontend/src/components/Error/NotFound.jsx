import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const NotFound = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-700">
            404
          </h1>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Go Back
          </button>
          
          {user ? (
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Home
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotFound