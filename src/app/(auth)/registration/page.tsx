import React from 'react'

function page() {
  return (
    <div>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div>
            <h3 className="text-red-400">Registration Paused</h3>
            <p>Sorry for inconvinience caused. Be back soon</p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default page
