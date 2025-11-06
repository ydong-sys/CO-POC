
import React from 'react';
import { GoogleLogoIcon, ChevronDownIcon } from './icons';

const Sidebar: React.FC = () => {
  const navItems = ['Courses', 'Projects', 'Programs', 'Specializations', 'Authoring AI tools'];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 pt-6 flex flex-col shrink-0">
      <div className="px-2 pb-4 mb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <GoogleLogoIcon className="h-6" />
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        </div>
      </div>
      <nav className="flex-1">
        <ul>
          {navItems.map((item, index) => (
            <li key={item} className="my-1">
              <a
                href="#"
                className={`flex items-center py-2 px-4 rounded-md text-sm font-medium ${
                  index === 0
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
