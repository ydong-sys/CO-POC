import React from 'react';
import { CloseIcon, TooltipInfoIcon } from './icons';

interface OptimizationStrategyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => void;
}

const strategyData = [
    {
        module: 2,
        type: 'Dialogue',
        rationale: 'Drop-off after 45 % of module',
        lift: 5,
        insights: {
            title: 'Learner Behavior Insights',
            points: [
                'Engagement curve: 45 % drop between 2.2 → 2.3',
                'Avg time-on-task: 6 min (-2 min vs bench)',
                'Similar courses that added Dialogues: +5 % retention'
            ]
        }
    },
    {
        module: 3,
        type: 'Role Play',
        rationale: 'Missing applied practice',
        lift: 7,
        insights: {
            title: 'Learner Behavior Insights',
            points: [
                'Low scores on "applied learning" survey questions.',
                '72% of learners skip optional practice quizzes.',
                'Adding role-play scenarios increased skill ratings by 8% in similar courses.'
            ]
        }
    },
    {
        module: 4,
        type: 'Tools-based Lab',
        rationale: 'Reinforce skill demo',
        lift: 6,
        insights: {
            title: 'Learner Behavior Insights',
            points: [
                'Video "Skill Demo" has a 60% replay rate, indicating confusion.',
                'Only 30% of learners complete the follow-up reading.',
                'Labs improve self-reported skill confidence by over 15%.'
            ]
        }
    },
];

const tooltipData: Record<string, string> = {
    'Dialogue': '+4.2pp higher completion when added before graded assignments.',
    'Role Play': '+7pp average improvement in learner satisfaction.',
    'Tools-based Lab': '+6pp raise in skill-application metrics.',
    'Practice Assignment': 'Reduces drop-off by 11% when added in early modules.',
};


const OptimizationStrategyModal: React.FC<OptimizationStrategyModalProps> = ({ isOpen, onClose, onApprove }) => {
    if (!isOpen) {
        return null;
    }

    const totalLift = strategyData.reduce((sum, item) => sum + item.lift, 0);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity"
            aria-modal="true"
            role="dialog"
        >
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all">
                <div className="p-6 border-b flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-bold text-gray-800">Proposed Optimization Strategy</h2>
                        <div className="relative group">
                            <TooltipInfoIcon className="w-5 h-5 text-gray-400 cursor-help" />
                            <div 
                                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-lg"
                                role="tooltip"
                            >
                                Based on engagement and completion trends, these item types typically improve learner interaction by 5–8 %.
                                <br />
                                <span className="text-gray-400">Data source: Coursera Engagement Model Q3 2025.</span>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-gray-800"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                         <div className="relative group text-sm text-gray-600 flex items-center cursor-help">
                            <span>Confidence: <span className="font-semibold text-gray-800">High</span></span>
                            <div className="flex items-center ml-2 space-x-1">
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                            </div>
                             <div 
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded-lg py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-lg"
                                role="tooltip"
                            >
                                Confidence is computed from model accuracy × data recency.
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close modal">
                            <CloseIcon className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <p className="text-sm text-gray-700 mb-2">
                        Coursera Coach analyzed learner engagement data for this course and generated a high-impact optimization plan.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        These changes are projected to increase overall engagement by <span className="font-bold text-green-600">+{totalLift}%</span>.
                    </p>
                    <div>
                        <table className="min-w-full">
                            <thead>
                                <tr className="text-left text-sm font-semibold text-gray-500 border-b">
                                    <th className="py-2 px-3">Module</th>
                                    <th className="py-2 px-3">New item type</th>
                                    <th className="py-2 px-3">
                                        <div className="flex items-center space-x-1">
                                            <span>Rationale</span>
                                            <div className="relative group">
                                                <span className="cursor-help">📈</span>
                                                <div 
                                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white text-gray-800 text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-lg border border-gray-200"
                                                    role="tooltip"
                                                >
                                                    <h4 className="font-bold mb-2 text-sm text-center">Engagement Curve (Module 2)</h4>
                                                    <div className="h-24 bg-gray-50 flex items-end justify-around p-2 rounded border border-gray-200 text-[10px] text-gray-500">
                                                       <div className="text-center w-1/4"><div className="bg-blue-300 mx-auto" style={{height: '90%', width:'80%'}}></div>2.1</div>
                                                       <div className="text-center w-1/4"><div className="bg-blue-300 mx-auto" style={{height: '85%', width:'80%'}}></div>2.2</div>
                                                       <div className="text-center w-1/4"><div className="bg-red-300 mx-auto" style={{height: '45%', width:'80%'}}></div>2.3</div>
                                                       <div className="text-center w-1/4"><div className="bg-red-300 mx-auto" style={{height: '35%', width:'80%'}}></div>2.4</div>
                                                    </div>
                                                     <p className="text-center mt-2 text-gray-500">Illustrates drop-off from 2.2 to 2.3.</p>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-white" style={{filter: 'drop-shadow(0 1px 0px rgba(0,0,0,0.1))'}}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </th>
                                    <th className="py-2 px-3 text-right">Predicted lift</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {strategyData.map((item) => (
                                    <tr key={item.module} className="text-sm text-gray-700">
                                        <td className="py-3 px-3 font-medium">{item.module}</td>
                                        <td className="py-3 px-3">
                                            <div className="flex items-center space-x-1">
                                                <span>{item.type}</span>
                                                {tooltipData[item.type] && (
                                                    <div className="relative group">
                                                        <TooltipInfoIcon className="w-4 h-4 text-gray-400 cursor-help" />
                                                        <div 
                                                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-800 text-white text-xs rounded-lg py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                                                            role="tooltip"
                                                        >
                                                            {tooltipData[item.type]}
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="relative group">
                                                <span className="cursor-pointer text-blue-600 underline decoration-dotted underline-offset-2 hover:text-blue-800">
                                                    {item.rationale}
                                                </span>
                                                <div 
                                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-white text-gray-800 text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-lg border border-gray-200"
                                                    role="tooltip"
                                                >
                                                    <h4 className="font-bold mb-2 text-sm">{item.insights.title}</h4>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        {item.insights.points.map((point, index) => (
                                                            <li key={index} className="text-gray-600">{point}</li>
                                                        ))}
                                                    </ul>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-white" style={{filter: 'drop-shadow(0 1px 0px rgba(0,0,0,0.1))'}}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-right font-semibold text-green-600">+{item.lift}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex justify-end items-center space-x-3 rounded-b-lg">
                    <button 
                        className="font-semibold text-gray-700 bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled
                    >
                        Customize Plan
                    </button>
                    <button 
                        onClick={onApprove}
                        className="font-semibold text-white bg-blue-600 rounded-md px-4 py-2 hover:bg-blue-700 highlight-pulse"
                    >
                        Approve Strategy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OptimizationStrategyModal;