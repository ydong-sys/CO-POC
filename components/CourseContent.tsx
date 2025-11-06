import React, { useState } from 'react';
import { recentlyVisitedCourses, allCourses } from '../constants';
import CourseList from './CourseList';
import Pagination from './Pagination';
import { InfoIcon, CloseIcon, SearchIcon, ChevronDownIcon } from './icons';

interface CourseContentProps {
  onNavigate: () => void;
}

const CourseContent: React.FC<CourseContentProps> = ({ onNavigate }) => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  return (
    <div className="p-6">
      <style>{`
        @keyframes pulse-highlight {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
        }
        .highlight-pulse {
          animation: pulse-highlight 2s infinite;
          border-radius: 0.375rem; /* rounded-md */
        }
      `}</style>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Courses</h2>
        <button className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-blue-700 transition text-sm">
          Create course
        </button>
      </div>

      {isBannerVisible && (
        <div className="bg-blue-50 border border-blue-200 text-gray-700 px-4 py-3 rounded-lg flex items-center justify-between mb-6">
          <div className="flex items-center">
            <InfoIcon className="w-6 h-6 mr-4 flex-shrink-0" />
            <p className="text-sm">
              We've identified <span className="font-bold text-gray-800">3 courses</span> with optimization opportunities to drive learner engagement and success.
            </p>
          </div>
          <div className="flex items-center space-x-4 ml-4">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(); }} className="font-bold text-blue-600 text-sm hover:underline whitespace-nowrap highlight-pulse px-3 py-1.5">View courses</a>
            <button onClick={() => setIsBannerVisible(false)} className="text-gray-500 hover:text-gray-800">
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="relative col-span-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative col-span-1">
          <select className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Optimization Status</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDownIcon />
          </div>
        </div>
        <div className="relative col-span-1">
          <select className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Status</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDownIcon />
          </div>
        </div>
        <div className="relative col-span-1">
          <select className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Associated with</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDownIcon />
          </div>
        </div>
      </div>

      <CourseList title="Recently Visited Courses" courses={recentlyVisitedCourses} />
      <CourseList title="All Courses" courses={allCourses} />
      
      <Pagination />
    </div>
  );
};

export default CourseContent;