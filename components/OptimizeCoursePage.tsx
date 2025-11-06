import React, { useState } from 'react';
import { Course } from '../types';
import { ChevronLeftIcon, ClockIcon, InfoIcon, ChevronDownIcon, UsersIcon, DialogueIcon, AssignmentIcon, GradedAssignmentIcon, LabIcon, CheckCircleIcon, CloseIcon } from './icons';
import CoachSidebar from './CoachSidebar';
import Toast from './Toast';
import LaunchChangesModal from './LaunchChangesModal';


const initialCourseData = {
    title: "Foundations of Data Science",
    modules: [
        {
            number: 1,
            title: "Data analysis Fundamentals",
            duration: "2h",
            content: [
                { type: 'description', text: "You'll begin with an introduction to the Google Advanced Data Analytics Certificate. Then, you'll explore the history of data science and ways that data science helps solve problems today." },
                {
                    type: 'learning_objectives',
                    title: "Learning objectives (3)",
                    items: [
                        { id: 1.1, text: "Understand program plans and expectations", assigned: true },
                        { id: 1.2, text: "Explore defining details of a data professional career", assigned: true },
                        { id: 1.3, text: "Describe the key concepts to be shared in the program, including learning outcomes", assigned: true },
                    ]
                },
                {
                    type: 'section',
                    title: "Get started with the certificate program",
                    items: [
                        { type: 'video', title: "Welcome to Module 1", duration: "10min" },
                        { type: 'video', title: "Welcome to the Google Advanced Data Analytics Certificate", duration: "10min" },
                    ]
                },
                { type: 'lesson', number: 2, title: "Lesson 2" }
            ]
        },
        { 
            number: 2, 
            title: "Data Literacy Basics", 
            duration: "2h",
            content: [
                 {
                    type: 'section',
                    title: "Suggested Content",
                    items: [
                        { type: 'dialogue', title: "New Dialogue", assignmentType: 'Dialogue', status: 'New', duration: '30 min', isSuggestion: true },
                    ]
                }
            ]
        },
        { 
            number: 3, 
            title: "Your career as a data professional", 
            duration: "1h",
            content: [
                 {
                    type: 'section',
                    title: "Suggested Content",
                    items: [
                        { type: 'assignment', title: "New Role Play", assignmentType: 'Role Play', status: 'New', isSuggestion: true },
                    ]
                }
            ]
        },
        { 
            number: 4, 
            title: "Data applications and workflow", 
            duration: "3h",
            content: [
                 {
                    type: 'section',
                    title: "Suggested Content",
                    items: [
                        { type: 'assignment', title: "New Tools-based Lab", assignmentType: 'Tools-based Lab', status: 'New', isSuggestion: true },
                    ]
                }
            ]
        },
    ]
};

const CollapsibleSection: React.FC<{ title: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean, className?: string }> = ({ title, children, defaultOpen = true, className = '' }) => {
    return (
        <details open={defaultOpen} className={`group ${className}`}>
            <summary className="flex items-center justify-between cursor-pointer list-none -ml-2 p-2 rounded-md hover:bg-gray-100">
                {title}
                <ChevronDownIcon className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="pl-6">
                {children}
            </div>
        </details>
    );
};

interface OptimizeCoursePageProps {
  course: Course;
  onBack: () => void;
}

const getSuggestionVisuals = (type: string) => {
    switch (type) {
        case 'Dialogue':
            return {
                Icon: DialogueIcon,
                borderColor: 'border-purple-500',
                bgColor: 'bg-purple-50',
                textColor: 'text-purple-700',
            };
        case 'Practice Assignment':
            return {
                Icon: AssignmentIcon,
                borderColor: 'border-blue-500',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-700',
            };
        case 'Graded Assignment':
             return {
                Icon: GradedAssignmentIcon,
                borderColor: 'border-teal-500',
                bgColor: 'bg-teal-50',
                textColor: 'text-teal-700',
            };
        case 'Role Play':
             return {
                Icon: UsersIcon,
                borderColor: 'border-green-500',
                bgColor: 'bg-green-50',
                textColor: 'text-green-700',
            };
        case 'Tools-based Lab':
             return {
                Icon: LabIcon,
                borderColor: 'border-blue-500',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-700',
            };
        default:
            return { Icon: InfoIcon, borderColor: 'border-gray-300', bgColor: 'bg-gray-50', textColor: 'text-gray-700' };
    }
};

const OptimizeCoursePage: React.FC<OptimizeCoursePageProps> = ({ course, onBack }) => {
    const [allExpanded, setAllExpanded] = useState(true);
    const [toastInfo, setToastInfo] = useState<{ message: string; key: number } | null>(null);
    const [isLaunched, setIsLaunched] = useState(false);
    const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
    const [currentCourseData, setCurrentCourseData] = useState(initialCourseData);

    const handleItemsAccepted = (count: number) => {
        if (count > 0) {
            const message = count === 1 
                ? "Item accepted ✓ Saved to draft branch."
                : `${count} items accepted ✓ Saved to draft branch.`;
            setToastInfo({ message, key: Date.now() });
        }
    };

    const handleLaunchClick = () => {
        setIsLaunchModalOpen(true);
    };

    const handleConfirmLaunch = () => {
        setIsLaunchModalOpen(false);
        setIsLaunched(true);

        setToastInfo({ message: "🚀 Optimization successfully published. New activities will appear to learners starting tomorrow.", key: Date.now() });
        
        const updatedData = JSON.parse(JSON.stringify(initialCourseData));
        const newItemsModule1 = [
            { type: 'assignment', title: "New Practice Assignment", assignmentType: 'Practice Assignment', status: 'New', questions: 12, isSuggestion: false, isLaunched: true },
            { type: 'assignment', title: "New Graded Assignment", assignmentType: 'Graded Assignment', status: 'New', questionBank: 30, integrityFeatures: 2, isSuggestion: false, isLaunched: true },
            { type: 'dialogue', title: "New Dialogue", assignmentType: 'Dialogue', status: 'New', duration: '30 min', isSuggestion: false, isLaunched: true },
        ];
        
        updatedData.modules.forEach((module: any) => {
            if (module.number === 1) {
                 const section = module.content.find((c: any) => c.type === 'section' && c.title === "Get started with the certificate program");
                 if (section) {
                    section.items.push(...newItemsModule1);
                 }
            }
            module.content = module.content.filter((c: any) => c.title !== 'Suggested Content');
        });
        
        setCurrentCourseData(updatedData);
    };

    return (
        <div className="flex bg-white h-screen overflow-hidden">
            <main className="flex-1 flex flex-col overflow-y-auto">
                {/* Page Header */}
                <header className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div className="flex items-center space-x-3">
                        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-semibold">{currentCourseData.title}</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="border border-gray-300 rounded-md px-4 py-1.5 font-semibold text-sm hover:bg-gray-100">
                            Edit
                        </button>
                        <div className="relative">
                            <button className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-1.5 font-semibold text-sm hover:bg-gray-100 bg-gray-100">
                                <span>coach</span>
                            </button>
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">3</span>
                        </div>
                        <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            Y
                        </div>
                        <button onClick={onBack} className="p-1 rounded-full hover:bg-gray-100">
                            <CloseIcon className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>
                </header>

                <div className="px-10 py-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center space-x-3">
                                <h2 className="text-2xl font-bold">Optimize your course</h2>
                                <span className={`flex items-center text-sm font-semibold px-2.5 py-1 rounded-full ${isLaunched ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {isLaunched ? <CheckCircleIcon className="w-4 h-4 mr-1.5" /> : <ClockIcon className="w-4 h-4 mr-1.5" />}
                                    {isLaunched ? 'Completed' : 'Pending'}
                                </span>
                            </div>
                             {isLaunched && (
                                <p className="text-sm text-gray-500 mt-1">Completed on August 22, 2025 by Kekeli Sackey <a href="#" className="text-blue-600 underline">+2 more</a></p>
                            )}
                        </div>
                        <button onClick={() => setAllExpanded(!allExpanded)} className="font-semibold text-sm text-blue-600">
                            {allExpanded ? 'Collapse all' : 'Expand all'}
                        </button>
                    </div>

                    {/* Course Structure */}
                    <div className="space-y-4">
                        {currentCourseData.modules.map((module, index) => (
                            <CollapsibleSection
                                key={module.number}
                                defaultOpen={allExpanded}
                                className="border-b pb-4"
                                title={
                                    <div className="flex items-center space-x-4">
                                        <span className="text-xl font-bold">{module.number}</span>
                                        <h3 className="text-xl font-bold">{module.title}</h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <ClockIcon className="w-4 h-4 mr-1" />
                                            <span>{module.duration}</span>
                                        </div>
                                    </div>
                                }
                            >
                                {module.content && module.content.map((item: any, idx: number) => {
                                    switch (item.type) {
                                        case 'description':
                                            return <p key={idx} className="text-gray-600 my-4">{item.text}</p>;
                                        case 'learning_objectives':
                                            return (
                                                <CollapsibleSection key={idx} title={<h4 className="font-semibold">{item.title}</h4>} className="my-4">
                                                    <ul className="space-y-3 mt-2">
                                                        {item.items.map((obj: any) => (
                                                            <li key={obj.id} className="flex justify-between items-center text-sm">
                                                                <span><span className="font-mono">{obj.id}</span> {obj.text}</span>
                                                                <span className="text-gray-500">Assigned to 1 item</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CollapsibleSection>
                                            );
                                        case 'section':
                                            return (
                                                <CollapsibleSection key={idx} title={<h4 className="font-semibold">{item.title}</h4>} className="my-4">
                                                    <div className="space-y-2 mt-2">
                                                        {item.items.map((subItem: any, subIdx: number) => {
                                                            const visuals = subItem.isSuggestion ? getSuggestionVisuals(subItem.assignmentType || '') : null;
                                                            return (
                                                                <div key={subIdx} className={`p-3 rounded-md ${visuals ? `border-l-4 ${visuals.borderColor} ${visuals.bgColor}` : ''}`}>
                                                                     <div className="flex items-center justify-between">
                                                                        <div className="flex items-center space-x-2">
                                                                            {getSuggestionVisuals(subItem.assignmentType || 'video').Icon && React.createElement(getSuggestionVisuals(subItem.assignmentType || 'video').Icon, {className: `w-5 h-5 ${getSuggestionVisuals(subItem.assignmentType || 'video').textColor} flex-shrink-0`})}
                                                                            <p className="font-semibold text-sm text-gray-800">{subItem.title}</p>
                                                                        </div>
                                                                         {subItem.isLaunched && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                                                                    </div>
                                                                    <div className={`flex items-center space-x-2 text-xs text-gray-500 mt-1 pl-7`}>
                                                                        <span>{subItem.assignmentType || 'Video'}</span>
                                                                        {subItem.status && <><span>•</span><span>{subItem.status}</span></>}
                                                                        {subItem.duration && <><span>•</span><span>{subItem.duration}</span></>}
                                                                        {subItem.questions && <><span>•</span><span>{subItem.questions} learner questions</span></>}
                                                                        {subItem.questionBank && <><span>•</span><span>{subItem.questionBank} in Question bank</span></>}
                                                                        {subItem.integrityFeatures && <><span>•</span><span>{subItem.integrityFeatures} integrity features</span><InfoIcon className="w-4 h-4 text-gray-400" /></>}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </CollapsibleSection>
                                            );
                                        case 'lesson':
                                            return (
                                                <div key={idx} className="flex items-center mt-4">
                                                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                                    <h4 className="font-semibold ml-1">{`Lesson ${item.number}`}</h4>
                                                </div>
                                            );
                                        default:
                                            return null;
                                    }
                                })}
                            </CollapsibleSection>
                        ))}
                    </div>

                </div>
            </main>
            <CoachSidebar 
                onItemsAccepted={handleItemsAccepted}
                onLaunch={handleLaunchClick}
                isLaunched={isLaunched}
            />
            {toastInfo && (
                <Toast
                    key={toastInfo.key}
                    message={toastInfo.message}
                    onClose={() => setToastInfo(null)}
                />
            )}
             <LaunchChangesModal
                isOpen={isLaunchModalOpen}
                onClose={() => setIsLaunchModalOpen(false)}
                onLaunch={handleConfirmLaunch}
            />
        </div>
    );
};

export default OptimizeCoursePage;