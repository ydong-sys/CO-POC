import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CourseContent from './components/CourseContent';
import FilteredCoursesPage from './components/FilteredCoursesPage';
import OptimizeCoursePage from './components/OptimizeCoursePage';
import OptimizationStrategyModal from './components/OptimizationStrategyModal';
import { Course } from './types';

const App: React.FC = () => {
  const [page, setPage] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);

  const handleNavigateToFiltered = () => setPage('filteredCourses');
  const handleNavigateToDashboard = () => setPage('dashboard');
  
  const handleRequestOptimize = (course: Course) => {
    setSelectedCourse(course);
    setIsStrategyModalOpen(true);
  };

  const handleApproveStrategy = () => {
    setIsStrategyModalOpen(false);
    if (selectedCourse) {
      setPage('optimizeCourse');
    }
  };
  
  const handleBackToFiltered = () => {
    setSelectedCourse(null);
    setPage('filteredCourses');
  }

  if (page === 'optimizeCourse' && selectedCourse) {
    return <OptimizeCoursePage course={selectedCourse} onBack={handleBackToFiltered} />;
  }

  return (
    <>
      <div className="bg-white min-h-screen font-sans text-gray-800 flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 bg-white">
            {page === 'dashboard' ? (
              <CourseContent onNavigate={handleNavigateToFiltered} />
            ) : (
              <FilteredCoursesPage onBack={handleNavigateToDashboard} onOptimize={handleRequestOptimize} />
            )}
          </main>
        </div>
      </div>
      <OptimizationStrategyModal 
        isOpen={isStrategyModalOpen}
        onClose={() => setIsStrategyModalOpen(false)}
        onApprove={handleApproveStrategy}
      />
    </>
  );
};

export default App;