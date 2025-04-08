import { Fragment, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleShowMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <Fragment>
      {/* Promotional Banner */}
      <div className="bg-indigo-600 text-white text-center py-2 px-4">
        <p className="text-sm font-medium">Get free delivery on orders over $100</p>
      </div>

      {/* Navigation bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo and Primary Nav */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">E</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">E-comm</span>
                </div>
              </Link>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  to="/women"
                  className="text-gray-800 hover:text-indigo-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-indigo-600 transition duration-300"
                >
                  Women
                </Link>
                <Link
                  to="/men"
                  className="text-gray-800 hover:text-indigo-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-indigo-600 transition duration-300"
                >
                  Men
                </Link>
              </div>
            </div>

            {/* Right: Search, Sign In, Cart */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="text-gray-600 hover:text-indigo-600 focus:outline-none transition duration-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <Link 
                to="/signin" 
                className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-300"
              >
                SIGNIN
              </Link>

              <Link to="/cart" className="flex items-center text-gray-600 hover:text-indigo-600 transition duration-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 7h11l-1.5-7M10 21h4" />
                </svg>
                <span className="ml-1 text-sm font-medium">0</span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={handleShowMenu}
                className="md:hidden text-gray-600 hover:text-indigo-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="border-t border-gray-200 py-3 px-4">
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for products..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button className="absolute right-3 top-2 text-gray-400 hover:text-gray-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {showMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/women"
              onClick={() => setShowMenu(false)}
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
            >
              Women
            </Link>
            <Link
              to="/men"
              onClick={() => setShowMenu(false)}
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
            >
              Men
            </Link>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Navbar;
