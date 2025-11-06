import React, { useState } from 'react';
import { Suggestion } from '../types';
import { CoachIcon, CloseIcon, ThumbsUpIcon, ThumbsDownIcon, ChevronDownIcon, TooltipInfoIcon, PencilIcon, CheckIcon, EyeIcon, DialogueIcon, UsersIcon, LabIcon, AssignmentIcon, GradedAssignmentIcon, CheckCircleIcon } from './icons';
import SuggestionPreviewModal from './SuggestionPreviewModal';
import { courseSuggestions as initialSuggestionsData } from '../constants';

const ConfidenceDots: React.FC<{ score: number }> = ({ score }) => {
    const filledCount = Math.round(score * 4);
    const dots = Array(4).fill(0).map((_, i) => (
        <span key={i} className={`w-2 h-2 rounded-full ${i < filledCount ? 'bg-green-500' : 'bg-gray-300'}`}></span>
    ));
    return <div className="flex items-center space-x-1">{dots}</div>;
};

interface SuggestionCardProps {
    suggestion: Suggestion;
    onPreview: (suggestion: Suggestion) => void;
    onEdit: (suggestion: Suggestion) => void;
    onAccept: (id: number) => void;
    onDismiss: (id: number) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onPreview, onEdit, onAccept, onDismiss }) => {
    const [isOpen, setIsOpen] = useState(suggestion.defaultOpen);

    const typeVisuals: Record<Suggestion['type'], { border: string; icon: React.FC<{className?: string}>; iconColor: string; }> = {
        'Dialogue': { border: 'border-l-purple-500', icon: DialogueIcon, iconColor: 'text-purple-700' },
        'Practice Assignment': { border: 'border-l-blue-500', icon: AssignmentIcon, iconColor: 'text-blue-700' },
        'Graded Assignment': { border: 'border-l-teal-500', icon: GradedAssignmentIcon, iconColor: 'text-teal-700' },
        'Role Play': { border: 'border-l-green-500', icon: UsersIcon, iconColor: 'text-green-700' },
        'Tools-based Lab': { border: 'border-l-blue-500', icon: LabIcon, iconColor: 'text-blue-700' },
    };
    const visuals = typeVisuals[suggestion.type];

    const getQualityLabel = (score: number) => {
        if (score >= 80) return 'Good';
        if (score >= 60) return 'Fair';
        return 'Needs Improvement';
    };

    return (
        <div className={`bg-white rounded-lg border border-gray-200 mb-3 border-l-4 ${visuals.border}`}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 text-left">
                <div className="flex items-center space-x-2">
                    <visuals.icon className={`w-5 h-5 ${visuals.iconColor}`} />
                    <span className="font-semibold text-sm text-gray-800">{`Add ${suggestion.type}: ${suggestion.title}`}</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-3 pb-3">
                    <div className="text-sm text-gray-600 mb-3 flex items-center">
                        <span>{suggestion.rationale}</span>
                         <div className="group inline-block ml-1 relative align-middle">
                           <TooltipInfoIcon className="w-4 h-4 text-gray-400 cursor-help" />
                           <div 
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-700 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                                role="tooltip"
                            >
                               {suggestion.rationaleTooltip}
                               <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-700"></div>
                           </div>
                        </div>
                    </div>

                    <div className="space-y-1 text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-md border border-gray-200">
                        {suggestion.learningObjective && (
                            <div className="flex items-start">
                                <span className="font-semibold text-gray-700 w-32 shrink-0">Learning Objective</span>
                                <span>{suggestion.learningObjective}</span>
                            </div>
                        )}
                         <div className="flex items-center">
                            <span className="font-semibold text-gray-700 w-32 shrink-0">Predicted Lift</span>
                            <span className="font-semibold text-green-600">+{suggestion.engagementLift}%</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-semibold text-gray-700 w-32 shrink-0">Quality Score</span>
                            <span>{suggestion.qualityScore} / 100 ({getQualityLabel(suggestion.qualityScore)})</span>
                        </div>
                         {suggestion.modelConfidence && (
                            <div className="flex items-center">
                                <span className="font-semibold text-gray-700 w-32 shrink-0">Model Confidence</span>
                                <ConfidenceDots score={suggestion.modelConfidence} />
                            </div>
                         )}
                    </div>
                    
                    <div className="flex items-center justify-end space-x-2 text-sm font-medium">
                        <button onClick={() => onPreview(suggestion)} className="flex items-center space-x-1.5 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
                            <EyeIcon className="w-4 h-4"/>
                            <span>Preview</span>
                        </button>
                        <button onClick={() => onEdit(suggestion)} className="flex items-center space-x-1.5 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
                            <PencilIcon className="w-4 h-4"/>
                            <span>Edit</span>
                        </button>
                        <button onClick={() => onDismiss(suggestion.id)} className="flex items-center space-x-1.5 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
                            <CloseIcon className="w-4 h-4"/>
                            <span>Dismiss</span>
                        </button>
                        <button onClick={() => onAccept(suggestion.id)} className="flex items-center space-x-1.5 px-3 py-1.5 border border-blue-600 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                            <CheckIcon className="w-4 h-4"/>
                            <span>Accept</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

interface CoachSidebarProps {
    onItemsAccepted: (count: number) => void;
    onLaunch: () => void;
    isLaunched: boolean;
}

const CoachSidebar: React.FC<CoachSidebarProps> = ({ onItemsAccepted, onLaunch, isLaunched }) => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestionsData);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
    const [isReadOnlyModal, setIsReadOnlyModal] = useState(false);

    const handlePreview = (suggestion: Suggestion) => {
        setSelectedSuggestion(suggestion);
        setIsReadOnlyModal(true);
        setIsPreviewModalOpen(true);
    };

    const handleEdit = (suggestion: Suggestion) => {
        setSelectedSuggestion(suggestion);
        setIsReadOnlyModal(false);
        setIsPreviewModalOpen(true);
    };
    
    const handleAccept = (id: number) => {
        setSuggestions(current => current.map(s => s.id === id ? { ...s, status: 'accepted' } : s));
        onItemsAccepted(1);
    };

    const handleClosePreview = () => {
        setIsPreviewModalOpen(false);
        setSelectedSuggestion(null);
    };

    const handleSaveFromModal = (savedSuggestion: Suggestion, edits: Record<string, any>) => {
        handleAccept(savedSuggestion.id);
        handleClosePreview();
    };

    const handleDismissSuggestion = (id: number) => {
        setSuggestions(current => current.map(s => (s.id === id ? { ...s, status: 'dismissed' } : s)));
    };
    
    const handleAcceptAll = () => {
        let acceptedCount = 0;
        setSuggestions(current =>
            current.map(s => {
                if (s.status === 'pending') {
                    acceptedCount++;
                    return { ...s, status: 'accepted' };
                }
                return s;
            })
        );
        if (acceptedCount > 0) {
            onItemsAccepted(acceptedCount);
        }
    };

    const handleDismissAll = () => {
        setSuggestions(current =>
            current.map(s => ((s.status === 'pending' || s.status === 'review') ? { ...s, status: 'dismissed' } : s))
        );
    };
    
    const totalSuggestions = initialSuggestionsData.length;
    const acceptedCount = suggestions.filter(s => s.status === 'accepted').length;
    const dismissedCount = suggestions.filter(s => s.status === 'dismissed').length;
    const allHandled = (acceptedCount + dismissedCount) === totalSuggestions;
    const progressPercent = totalSuggestions > 0 ? (acceptedCount / totalSuggestions) * 100 : 0;
    
    const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
        const moduleKey = `Module ${suggestion.moduleNumber}`;
        if (!acc[moduleKey]) {
            acc[moduleKey] = [];
        }
        acc[moduleKey].push(suggestion);
        return acc;
    }, {} as Record<string, Suggestion[]>);

    return (
        <aside className="w-[480px] bg-gray-50 border-l border-gray-200 flex flex-col h-screen">
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
            <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-xl">coach</h2>
                    <button className="text-gray-500 hover:text-gray-800">
                        <CloseIcon />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-start space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        Y
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">Yuki</p>
                        <p className="text-sm text-gray-600">Optimize this course</p>
                    </div>
                </div>

                <div className="flex items-start space-x-3 mb-6">
                    <CoachIcon />
                    <div>
                        <p className="font-semibold text-gray-800">Coach</p>
                        <p className="text-sm text-gray-600">
                            Sure! I've surfaced optimization opportunities identified by our learning experts for your review
                        </p>
                    </div>
                </div>

                {/* FIX: Use Object.keys() for better type inference on moduleSuggestions. */}
                {!allHandled && Object.keys(groupedSuggestions).map((moduleName) => {
                    const moduleSuggestions = groupedSuggestions[moduleName]!;
                    return (moduleSuggestions.some(s => s.status === 'pending' || s.status === 'review')) && (
                        <div key={moduleName} className="bg-gray-100 p-3 rounded-lg mb-4">
                            <p className="text-sm font-semibold text-gray-600 mb-3">{moduleName}</p>
                            
                            {moduleSuggestions
                                .filter(s => s.status === 'pending' || s.status === 'review')
                                .map(suggestion => (
                                    <SuggestionCard 
                                        key={suggestion.id} 
                                        suggestion={suggestion} 
                                        onPreview={handlePreview}
                                        onEdit={handleEdit}
                                        onAccept={handleAccept}
                                        onDismiss={handleDismissSuggestion}
                                    />
                                ))}
        
                            <div className="flex justify-end space-x-2 mt-3">
                                <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-md">
                                    <ThumbsUpIcon className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-md">
                                    <ThumbsDownIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {allHandled && !isLaunched && (
                    <>
                        {suggestions.filter(s => s.status === 'accepted').map(s => (
                            <div key={s.id} className="flex items-center justify-between p-3 rounded-md">
                                <span className="text-sm text-gray-600">{`Add: ${s.type}: ${s.title}`}</span>
                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                            </div>
                        ))}
                         <div className="flex items-start space-x-3 my-4">
                            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                Y
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Yuki</p>
                                <p className="text-sm text-gray-600">I accepted all suggestions.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 mb-6">
                            <CoachIcon />
                            <div>
                                <p className="font-semibold text-gray-800">Coach</p>
                                <p className="text-sm text-gray-600">
                                    Great! All suggestions were accepted. Continue to launch your changes to learners.
                                </p>
                            </div>
                        </div>
                    </>
                )}

            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
                {allHandled ? (
                     <button 
                        onClick={onLaunch}
                        disabled={isLaunched}
                        className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                        {isLaunched ? 'Changes Launched' : 'Launch changes'}
                    </button>
                ) : (
                    <>
                        <div className="mb-4">
                            <div className="flex justify-between items-center text-sm font-semibold mb-1">
                                <span className="text-gray-700">Progress</span>
                                <span className="text-gray-500">
                                {acceptedCount} of {totalSuggestions} items approved {progressPercent === 100 && <CheckIcon className="w-4 h-4 inline-block ml-1 text-green-600" />}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                        </div>
                        <button 
                            onClick={handleAcceptAll}
                            disabled={!suggestions.some(s => s.status === 'pending')}
                            className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-blue-700 mb-2 highlight-pulse">
                            Accept all
                        </button>
                        <button 
                            onClick={handleDismissAll}
                            className="w-full text-center text-blue-600 font-semibold py-2.5">
                            Dismiss all
                        </button>
                    </>
                )}
                <p className="text-xs text-gray-500 mt-3 text-center">
                    Coach is powered by AI, so check for mistakes and don't share sensitive info. Your data will be used in accordance with <a href="#" className="underline">Coursera's Privacy Notice</a>.
                </p>
            </div>
             <SuggestionPreviewModal 
                isOpen={isPreviewModalOpen}
                onClose={handleClosePreview}
                onSave={handleSaveFromModal}
                suggestion={selectedSuggestion}
                isReadOnly={isReadOnlyModal}
            />
        </aside>
    );
};

export default CoachSidebar;