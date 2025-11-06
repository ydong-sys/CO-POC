
import React from 'react';
import { Course } from '../types';
import CourseRow from './CourseRow';

interface CourseListProps {
  title: string;
  courses: Course[];
}

const CourseList: React.FC<CourseListProps> = ({ title, courses }) => {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-baseline mb-2">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <span className="text-sm text-gray-500">{courses.length} Courses</span>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-12 gap-4 py-2 text-sm font-semibold text-gray-500 border-b">
            <div className="col-span-4">Courses</div>
            <div className="col-span-4">Sessions</div>
            <div className="col-span-3">Associated with</div>
            <div className="col-span-1"></div>
          </div>
          <div>
            {courses.map(course => (
              <CourseRow key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseList;
