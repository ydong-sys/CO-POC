
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

const Pagination: React.FC = () => {
  return (
    <div className="flex justify-end items-center mt-6">
      <nav className="inline-flex items-center space-x-1" role="navigation" aria-label="Pagination">
        <button className="p-2 rounded-md hover:bg-gray-100 border border-gray-300" aria-label="Previous Page">
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md" aria-current="page">1</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">2</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">3</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">4</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">5</button>
        <span className="px-4 py-2 text-sm font-medium text-gray-700">...</span>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">60</button>
        <button className="p-2 rounded-md hover:bg-gray-100 border border-gray-300" aria-label="Next Page">
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
