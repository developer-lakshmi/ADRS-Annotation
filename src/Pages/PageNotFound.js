import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../Assets/assets';

const PageNotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-darkTheme p-6">
    <img src={assets.Page_not_found} alt="404 Not Found" className="w-64 h-auto mb-4" />
    <p className="text-gray-600 dark:text-gray-400 mb-6">The page you’re looking for doesn’t exist.</p>
    <Link to="/Home" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Back Home</Link>
  </div>
);

export default PageNotFound;
