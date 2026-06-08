import React from 'react'

const Navbar = ({ isLoggedIn, userEmail, onLogout }) => {
  return (
    <nav className='bg-purple-400 fixed top-0 w-full z-50'>
      <div className="mycontainer flex justify-between items-center px-2 sm:px-4 py-3 gap-2 sm:gap-4 min-h-14">
        <div className="logo font-bold text-white text-lg sm:text-2xl hover:scale-110 transition duration-300 cursor-pointer flex-shrink-0">
          <h1>
            <span className='text-green-600'>&lt;</span>
            VX
            <span className='text-green-700'>/&gt;</span>
          </h1>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-4 flex-shrink-0">
          {isLoggedIn && (
            <span className='text-white text-xs sm:text-sm font-semibold truncate'>
              {userEmail}
            </span>
          )}

          <button
            onClick={onLogout}
            className="bg-white text-purple-600 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm font-semibold hover:bg-green-100 transition whitespace-nowrap flex-shrink-0"
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
