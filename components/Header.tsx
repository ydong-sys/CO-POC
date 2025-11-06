import React from 'react';
import { ChevronDownIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-blue-700">coursera</h1>
      </div>
      <nav className="hidden md:flex items-center space-x-8">
        <a href="#" className="text-blue-700 font-semibold border-b-2 border-blue-700 pb-3">Home</a>
        <a href="#" className="text-gray-600 hover:text-blue-700">Analytics</a>
        <a href="#" className="text-gray-600 hover:text-blue-700">Institution</a>
        <a href="#" className="text-gray-600 hover:text-blue-700">Messages</a>
        <a href="#" className="text-gray-600 hover:text-blue-700">Help</a>
      </nav>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
          Y
        </div>
        <ChevronDownIcon className="w-5 h-5 text-gray-600" />
      </div>
    </header>
  );
};

export default Header;