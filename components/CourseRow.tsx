import React from 'react';
import { Course } from '../types';
import { EllipsisHorizontalIcon, ChevronDownIcon } from './icons';

interface CourseRowProps {
  course: Course;
  variant?: 'dashboard' | 'filtered';
  onOptimize?: (course: Course) => void;
}

const CourseRow: React.FC<CourseRowProps> = ({ course, variant = 'dashboard', onOptimize }) => {
  const isFilteredView = variant === 'filtered';

  if (isFilteredView) {
    const priorityScore = course.enrollments * (course.potentialLift || 0);
    const formattedPriorityScore = (priorityScore / 100000).toFixed(1);
    const isHighImpact = priorityScore > 1500000;
    const trend = course.engagementTrend;

    return (
      <div className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-200 last:border-b-0">
        <div className="col-span-4 flex items-center">
          <div className="w-10 h-10 bg-white rounded-md mr-4 flex-shrink-0 border-2 border-dashed border-purple-300 flex items-center justify-center text-xs text-purple-600 text-center leading-tight">
            Free image space
          </div>
          <div>
            <div className="flex items-center">
              <a href="#" onClick={(e) => { e.preventDefault(); onOptimize && onOptimize(course); }} className="font-semibold text-gray-800 hover:text-blue-600 underline text-sm">{course.title}</a>
              {isHighImpact && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  High impact
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 flex items-center space-x-2">
              <span>{course.enrollments.toLocaleString()} enrollments</span>
              <span>·</span>
              <span>{course.associatedWith}</span>
            </div>
          </div>
        </div>
        <div className="col-span-2 text-sm font-semibold text-gray-800 text-center flex items-center justify-center">
          <span>{course.engagement}%</span>
          {trend !== undefined && trend !== 0 && (
            <span className={`ml-2 flex items-center text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '🔼' : '🔽'}
              <span className="ml-1">({trend > 0 ? '+' : ''}{trend}%)</span>
            </span>
          )}
        </div>
        <div className="col-span-2 text-sm font-semibold text-gray-800 text-center">
          {course.completion}%
        </div>
        <div className="col-span-1 text-sm font-semibold text-green-600 text-center">
          +{course.potentialLift}%
        </div>
        <div className="col-span-2 text-sm font-semibold text-gray-800 text-center">
          {formattedPriorityScore}
        </div>
        <div className="col-span-1 flex justify-end">
          <button
            onClick={() => onOptimize && onOptimize(course)}
            className="bg-blue-100 text-blue-700 font-semibold py-1 px-4 rounded-md hover:bg-blue-200 transition text-sm highlight-pulse">
            Optimize
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-200 last:border-b-0">
      <div className="col-span-4 flex items-center">
        <div className="w-10 h-10 bg-gray-100 rounded-md mr-4 flex-shrink-0 border-2 border-dashed border-gray-300 flex items-center justify-center">
        </div>
        <div>
          <a href="#" className="font-semibold text-gray-800 hover:text-blue-600 underline text-sm">{course.title}</a>
          <p className="text-xs text-gray-500">{course.enrollments.toLocaleString()} enrollments</p>
        </div>
      </div>
      <div className="col-span-4 text-sm">
        <a href="#" className="font-semibold text-gray-800 hover:text-blue-600 underline">{course.session}</a>
        <div className="text-xs text-gray-500 flex items-center space-x-2">
          <span>{course.sessionDate}</span>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">{course.status}</span>
          <a href="#" className="text-gray-700 underline hover:text-blue-600 flex items-center">
            Show 2 more <ChevronDownIcon className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
      <div className="col-span-3 text-sm text-gray-600">
        {course.associatedWith}
      </div>
      <div className="col-span-1 flex justify-end">
        <button className="text-gray-500 hover:text-gray-800">
          <EllipsisHorizontalIcon />
        </button>
      </div>
    </div>
  );
};

export default CourseRow;