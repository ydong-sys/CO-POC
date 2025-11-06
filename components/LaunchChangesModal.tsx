import React from 'react';
import { CloseIcon, WarningIcon, SparklesIcon } from './icons';
import { courseSuggestions } from '../constants';
import { Suggestion } from '../types';

interface LaunchChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: () => void;
}

const getVersionNoteText = (type: Suggestion['type']): string => {
  switch (type) {
    case 'Dialogue':
      return 'Dialogue discussion';
    case 'Role Play':
      return 'Applied role play';
    case 'Tools-based Lab':
      return 'Interactive lab';
    default:
      return type;
  }
};

const LaunchChangesModal: React.FC<LaunchChangesModalProps> = ({ isOpen, onClose, onLaunch }) => {
  if (!isOpen) return null;

  const totalLift = courseSuggestions.reduce((sum, item) => sum + item.engagementLift, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
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
        }
      `}</style>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform">
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Launch changes</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 highlight-pulse" aria-label="Close modal">
            <CloseIcon className="w-5 h-5 text-gray-500" />
          </button>
        </header>

        <main className="p-6">
          <p className="text-sm text-gray-600 mb-4">Foundations of Data Science | [Session name]</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm">
            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2 text-blue-600"/>
              Optimization Summary
            </h3>
            <p className="text-gray-700 mb-3">
              You’re about to publish {courseSuggestions.length} new items recommended by Coursera Coach:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4 pl-2">
              {courseSuggestions.map(suggestion => (
                <li key={suggestion.id}>
                  Module {suggestion.moduleNumber} – {suggestion.type}: “{suggestion.title}”
                </li>
              ))}
            </ul>
            <div className="flex items-center space-x-6 text-gray-700">
              <div>
                Predicted overall engagement lift: <span className="font-bold text-green-600">+{totalLift}%</span>
              </div>
              <div>
                Model confidence: <span className="font-bold text-gray-800">High (0.82)</span>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg flex items-start space-x-3 mb-6">
            <WarningIcon className="w-5 h-5 text-orange-500 mt-0.5" />
            <p className="text-sm">
              Please review this information carefully. With few exceptions, it can’t be changed after launch. <a href="#" className="font-semibold underline hover:text-orange-900">Learn more</a>
            </p>
          </div>

          <h3 className="text-base font-bold text-gray-800 mb-4">Course Information</h3>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-gray-500 mb-2">YOUR ORGANIZATION</h4>
              <p className="font-semibold text-gray-800">4 Modules</p>
              <p className="text-gray-600 mb-4">Modules can’t be added, removed, or reordered after launch</p>
              
              <h4 className="font-semibold text-gray-500 mb-2">AVAILABILITY</h4>
              <p className="font-semibold text-gray-800">Always available</p>
              <p className="text-gray-600">Learners who enroll in upcoming sessions will see this new version of your course. If your changes are urgent and need to be launched sooner, please <a href="#" className="text-blue-600 underline hover:text-blue-800">contact partner support</a>.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-500 mb-2">GRADED ITEMS</h4>
              <p className="font-semibold text-gray-800">1 Published graded item</p>
              <p className="text-gray-600">The grading formula can’t be changed after launch. Graded items cannot be published, added, or removed after launch.</p>
            </div>
          </div>

          <div className="mt-6 text-sm">
            <div>
                <h4 className="font-semibold text-gray-500 mb-2">VERSION NOTES (LEARNER FACING)</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-gray-800">
                    <p className="mb-2">
                    This version adds new interactive learning activities to enhance practice and engagement:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                    {courseSuggestions.map((suggestion) => (
                        <li key={suggestion.id}>
                        {getVersionNoteText(suggestion.type)} (Module {suggestion.moduleNumber})
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
        </main>
        
        <footer className="px-6 py-4 bg-gray-50 flex justify-between items-center rounded-b-lg border-t">
          <button className="font-semibold text-blue-600 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 text-sm highlight-pulse">View as learner</button>
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="font-semibold text-gray-700 bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 text-sm highlight-pulse">Cancel</button>
            <button onClick={onLaunch} className="font-semibold text-white bg-blue-600 rounded-md px-4 py-2 hover:bg-blue-700 text-sm highlight-pulse">Launch Optimization to Learners</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LaunchChangesModal;