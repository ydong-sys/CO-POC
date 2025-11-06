import React from 'react';
import { filteredCourses } from '../constants';
import CourseRow from './CourseRow';
import { SearchIcon, ChevronDownIcon, CloseIcon, ChevronLeftIcon, TooltipInfoIcon } from './icons';
import { Course } from '../types';

interface FilteredCoursesPageProps {
  onBack: () => void;
  onOptimize: (course: Course) => void;
}

const FilteredCoursesPage: React.FC<FilteredCoursesPageProps> = ({ onBack, onOptimize }) => {
  const coursesPending = filteredCourses.length;
  const totalPotentialLift = filteredCourses.reduce((sum, course) => sum + (course.potentialLift || 0), 0);
  const averageLift = coursesPending > 0 ? Math.round(totalPotentialLift / coursesPending) : 0;
  const totalEnrollments = filteredCourses.reduce((sum, course) => sum + course.enrollments, 0);
  const learnerReach = Math.round(totalEnrollments / 1000);

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
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back to dashboard"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-3xl font-bold text-gray-800">Courses</h2>
        </div>
        <button className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-blue-700 transition text-sm">
          Create course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
            <option>Pending Optimization</option>
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

      <div className="flex items-center space-x-4 mb-6">
        <span className="text-sm text-gray-600">Filtered by</span>
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700">
          <span>Pending Optimization</span>
          <button className="ml-2 text-gray-500 hover:text-gray-800">
            <CloseIcon className="w-3 h-3" />
          </button>
        </div>
        <button className="text-sm text-blue-600 hover:underline">Clear all filters</button>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-sm">
        <h4 className="text-md font-semibold text-gray-800 mb-3">📊 Optimization Summary</h4>
        <div className="flex items-center space-x-2 text-gray-600">
          <span>Courses pending optimization:</span>
          <span className="font-bold text-gray-800">{coursesPending}</span>
          <span className="text-gray-300 mx-2">|</span>
          <span>Average potential lift:</span>
          <span className="font-bold text-green-600">+{averageLift}%</span>
          <span className="text-gray-300 mx-2">|</span>
          <span>Est. learner reach:</span>
          <span className="font-bold text-gray-800">{learnerReach}K</span>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-12 gap-4 py-2 text-sm font-semibold text-gray-500 border-b">
            <div className="col-span-4">{filteredCourses.length} Courses</div>
            <div className="col-span-2 text-center">Engagement %</div>
            <div className="col-span-2 text-center">Completion %</div>
            <div className="col-span-1 text-center">
              <div className="relative group inline-flex items-center justify-center">
                <span>Potential Lift</span>
                <TooltipInfoIcon className="w-4 h-4 ml-1 text-gray-400 cursor-help" />
                <div 
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-700 text-white text-xs text-center rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                    role="tooltip"
                >
                    Calculated using engagement, completion, and HOL ratio from past 90 days.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-700"></div>
                </div>
              </div>
            </div>
            <div className="col-span-2 text-center">Priority Score</div>
            <div className="col-span-1"></div>
        </div>
        <div>
          {filteredCourses.map(course => (
            <CourseRow key={course.id} course={course} variant="filtered" onOptimize={onOptimize} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilteredCoursesPage;