import React, { useState, useEffect } from 'react';
import { Suggestion } from '../types';
import { CloseIcon, RefreshIcon, ChevronDownIcon, SparklesIcon, CheckCircleIcon, WarningIcon, XCircleIcon } from './icons';

interface SuggestionPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (suggestion: Suggestion, edits: Record<string, any>) => void;
    suggestion: Suggestion | null;
    isReadOnly: boolean;
}

const getQualityLabel = (score: number) => {
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
};

const mockContent: Record<Suggestion['type'], any> = {
    'Practice Assignment': {
        description: 'In this assignment, you will analyze a provided dataset of customer transactions to identify trends in purchasing behavior. You will be expected to use basic data manipulation and visualization techniques learned in this module.',
        duration: '60', difficulty: 'Intermediate', tone: 'Instructional',
    },
    'Graded Assignment': {
        description: 'This case study requires you to evaluate the ethical implications of using a predictive AI model for loan applications. You should refer to the ethical frameworks discussed in Module 1 and provide a detailed analysis.',
        duration: '90', difficulty: 'Advanced', tone: 'Instructional',
    },
    'Dialogue': {
        description: 'Post your initial project proposal (max 200 words) in the forum. Then, review at least two proposals from your peers and provide constructive feedback focusing on the clarity of the research question and the feasibility of the proposed methodology.',
        duration: '45', difficulty: 'Beginner', tone: 'Conversational',
    },
    'Role Play': {
        scenario: 'Act as a project manager presenting a project update to a stakeholder.',
        personas: 'Persona 1: Project Manager (You)\nPersona 2: Skeptical Stakeholder (Peer)',
        assessment: 'Clarity of communication\nHandling of objections\nProfessionalism',
        duration: '30', difficulty: 'Intermediate', tone: 'Scenario-based',
    },
    'Tools-based Lab': {
        toolEnv: 'Jupyter Notebook',
        starterFiles: '/path/to/customer_data.csv',
        deliverable: 'A dashboard that effectively communicates insights from the provided sales data.',
        duration: '75', difficulty: 'Intermediate', tone: 'Instructional',
    },
};

const courseLearningObjectives = [
    { id: '1.1', text: 'Understand program plans and expectations' },
    { id: '1.3', text: 'Describe key concepts in data science' },
    { id: '2.1', text: 'Apply data analysis techniques' },
    { id: '4.2', text: 'Utilize data workflow tools effectively' },
];

const pedagogyChecksData = {
  'Learning Objectives & Alignment': [
    { status: 'passed', message: 'Covers 1 mapped LO (LO 1.3)' },
    { status: 'warning', message: 'Missing alignment to a higher-order LO (e.g., Analyze, Evaluate).', aiFix: true },
  ],
  'Cognitive Load & Duration': [
     { status: 'passed', message: 'Estimated duration (45 min) is within the recommended 60 min for this item type.' },
  ],
  'Assessment & Feedback Quality': [
    { status: 'warning', message: 'Prompt does not explicitly ask learners to reflect on their own understanding.', aiFix: true },
  ],
  'Accessibility & Inclusivity': [
     { status: 'passed', message: 'Reading level is suitable for the target audience.' },
  ],
};

const dialoguePreviewConversation = [
    { speaker: 'learner', text: "Hi! I'm working on a proposal to analyze customer churn for an e-commerce site. My main idea is to use logistic regression to predict which customers are likely to leave." },
    { speaker: 'coach', text: "That's a solid start! Logistic regression is a good choice for this kind of problem. How will you define 'churn' specifically? Is it inactivity for 30 days, or a cancelled subscription?" },
    { speaker: 'learner', text: "Good question. I'll define it as no purchases in the last 90 days. I think that's a reasonable timeframe for our business." },
    { speaker: 'coach', text: "Great, having a clear definition is key. What features are you considering for your model? For example, purchase frequency, average order value, or customer support interactions?" }
];


const FormRow: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
        {children}
    </div>
);

const QualityBadge: React.FC<{ score: number }> = ({ score }) => {
    const label = getQualityLabel(score);
    const colorClasses = score >= 80 ? 'bg-green-100 text-green-800' : score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-100';
    return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorClasses}`}>{label}</span>;
};

const CollapsibleSection: React.FC<{ title: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => (
    <details open={defaultOpen} className="group border border-gray-200 rounded-md">
        <summary className="flex items-center justify-between cursor-pointer list-none p-3 bg-gray-50 rounded-t-md hover:bg-gray-100">
            <h3 className="text-base font-semibold text-gray-800">{title}</h3>
            <ChevronDownIcon className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
        </summary>
        <div className="p-4 border-t border-gray-200">
            {children}
        </div>
    </details>
);

const ChatBubble: React.FC<{ message: string, isLearner: boolean, avatar: React.ReactNode }> = ({ message, isLearner, avatar }) => (
    <div className={`flex items-end gap-3 my-4 ${isLearner ? 'justify-end' : 'justify-start'}`}>
        {!isLearner && <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">{avatar}</div>}
        <div className={`px-4 py-3 rounded-2xl max-w-md shadow-sm ${isLearner ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border'}`}>
            <p className="text-sm leading-relaxed">{message}</p>
        </div>
        {isLearner && <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">{avatar}</div>}
    </div>
);


const SuggestionPreviewModal: React.FC<SuggestionPreviewModalProps> = ({ isOpen, onSave, onClose, suggestion, isReadOnly }) => {
    const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'pedagogy'>('edit');
    const [formState, setFormState] = useState<Record<string, any>>({});
    const [isRegenerating, setIsRegenerating] = useState(false);
    
    useEffect(() => {
        if (suggestion) {
            const content = mockContent[suggestion.type];
            let initialState = {
                title: suggestion.title,
                linkedLO: suggestion.learningObjective,
                duration: content?.duration || '30',
                difficulty: content?.difficulty || 'Intermediate',
                tone: content?.tone || 'Instructional',
                ...content
            };

            if (suggestion.type === 'Dialogue') {
                initialState = {
                    ...initialState,
                    aiPersona: 'Coach AI',
                    numberOfTurns: 5,
                }
            }
            setFormState(initialState);
            setActiveTab(isReadOnly ? 'preview' : 'edit');
        }
    }, [suggestion, isReadOnly]);

    if (!isOpen || !suggestion) return null;

    const handleSave = () => onSave(suggestion, formState);
    
    const handleInputChange = (field: string, value: any) => {
        setFormState(prev => ({...prev, [field]: value}));
    };

    const inputClassName = `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`;
    const textAreaClassName = `${inputClassName} min-h-[100px]`;

    const getAvatar = (persona: string) => {
        if (!persona) return 'AI';
        const parts = persona.split(' ');
        if (parts.length > 1) {
            return parts[0][0] + parts[1][0];
        }
        return persona.substring(0,2).toUpperCase();
    }

    const renderTypeSpecificFields = () => {
        switch(suggestion.type) {
            case 'Dialogue':
                 return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                            <FormRow label="AI Persona">
                                <select 
                                    value={formState.aiPersona} 
                                    onChange={e => handleInputChange('aiPersona', e.target.value)} 
                                    className={inputClassName} 
                                    disabled={isReadOnly}
                                >
                                    <option>Coach AI</option>
                                    <option>Peer</option>
                                    <option>Interviewer</option>
                                </select>
                            </FormRow>
                            <FormRow label="# of Turns">
                                <input 
                                    type="number" 
                                    value={formState.numberOfTurns} 
                                    onChange={e => handleInputChange('numberOfTurns', parseInt(e.target.value))} 
                                    readOnly={isReadOnly} 
                                    className={inputClassName}
                                    min="1"
                                />
                            </FormRow>
                        </div>
                        <FormRow label="Prompt Script">
                            <textarea 
                                value={formState.description} 
                                onChange={e => handleInputChange('description', e.target.value)} 
                                readOnly={isReadOnly} 
                                className={textAreaClassName}
                                rows={4}
                                placeholder="Enter the opening prompt for the dialogue..."
                            />
                        </FormRow>
                    </div>
                );
            case 'Practice Assignment':
            case 'Graded Assignment':
                return (
                    <div className="space-y-4">
                        <FormRow label="Instructions"><textarea value={formState.description} onChange={e => handleInputChange('description', e.target.value)} readOnly={isReadOnly} className={textAreaClassName} /></FormRow>
                        <div className="grid grid-cols-3 gap-4">
                            <FormRow label="Question Type"><select className={inputClassName} disabled={isReadOnly}><option>Multiple Choice</option></select></FormRow>
                            <FormRow label="Points"><input type="number" defaultValue={10} readOnly={isReadOnly} className={inputClassName} /></FormRow>
                            <FormRow label="Attempts"><input type="number" defaultValue={2} readOnly={isReadOnly} className={inputClassName} /></FormRow>
                        </div>
                    </div>
                );
            case 'Role Play':
                 return (
                    <div className="space-y-4">
                        <FormRow label="Scenario"><textarea value={formState.scenario} onChange={e => handleInputChange('scenario', e.target.value)} readOnly={isReadOnly} className={textAreaClassName} /></FormRow>
                        <FormRow label="Personas"><textarea value={formState.personas} onChange={e => handleInputChange('personas', e.target.value)} readOnly={isReadOnly} className={textAreaClassName} /></FormRow>
                        <FormRow label="Assessment Rubric (Behavioral Checklist)"><textarea value={formState.assessment} onChange={e => handleInputChange('assessment', e.target.value)} readOnly={isReadOnly} className={textAreaClassName} /></FormRow>
                    </div>
                );
            case 'Tools-based Lab':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <FormRow label="Tool Environment">
                                <select 
                                    value={formState.toolEnv} 
                                    onChange={e => handleInputChange('toolEnv', e.target.value)} 
                                    className={inputClassName} 
                                    disabled={isReadOnly}
                                >
                                    <option>Jupyter Notebook</option>
                                    <option>VS Code</option>
                                    <option>Google Colab</option>
                                </select>
                            </FormRow>
                             <FormRow label="Starter Files (path)">
                                <input 
                                    type="text" 
                                    value={formState.starterFiles} 
                                    onChange={e => handleInputChange('starterFiles', e.target.value)} 
                                    readOnly={isReadOnly} 
                                    className={inputClassName} 
                                />
                            </FormRow>
                        </div>
                        <FormRow label="Expected Deliverable">
                            <textarea 
                                value={formState.deliverable} 
                                onChange={e => handleInputChange('deliverable', e.target.value)} 
                                readOnly={isReadOnly} 
                                className={textAreaClassName} 
                            />
                        </FormRow>
                         <FormRow label="Code Editor Pane">
                            <textarea
                                placeholder="// Start coding here..."
                                readOnly={isReadOnly}
                                className={`${textAreaClassName} bg-gray-800 text-green-300 font-mono text-sm min-h-[200px]`}
                            />
                        </FormRow>
                        <FormRow label="Upload Starter Files">
                            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className={`relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ${isReadOnly ? 'pointer-events-none' : ''}`}>
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" disabled={isReadOnly} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, CSV up to 10MB
                                    </p>
                                </div>
                            </div>
                        </FormRow>
                    </div>
                );
            default:
                return <FormRow label="Description"><textarea value={formState.description} onChange={e => handleInputChange('description', e.target.value)} readOnly={isReadOnly} className={textAreaClassName} /></FormRow>;
        }
    };

    const TabButton: React.FC<{label: string, name: typeof activeTab}> = ({label, name}) => (
        <button
            onClick={() => setActiveTab(name)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-md ${activeTab === name ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
        >{label}</button>
    );
    
    const pedagogyChecks = Object.values(pedagogyChecksData).flat();
    const passedCount = pedagogyChecks.filter(c => c.status === 'passed').length;
    const warningCount = pedagogyChecks.filter(c => c.status === 'warning').length;
    const criticalCount = pedagogyChecks.filter(c => c.status === 'critical').length;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl transform flex flex-col max-h-[90vh]">
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center space-x-3 text-gray-700">
                        <h2 className="text-lg font-bold text-gray-800">{isReadOnly ? 'Preview' : 'Edit'} {suggestion.type}</h2>
                        <span className="text-gray-300">·</span>
                        <span>Module {suggestion.moduleNumber}</span>
                        <span className="text-gray-300">·</span>
                        <div className="flex items-center space-x-1.5">
                            <span>Quality: {suggestion.qualityScore}/100</span>
                            <QualityBadge score={suggestion.qualityScore} />
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close modal">
                        <CloseIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                     <div className="border-b border-gray-200 -mt-2 mb-6">
                        <nav className="flex space-x-2">
                            <TabButton label="Edit View" name="edit" />
                            <TabButton label="Learner Preview" name="preview" />
                            <TabButton label="Pedagogy Check" name="pedagogy" />
                        </nav>
                    </div>

                    {activeTab === 'edit' && !isReadOnly && (
                        <div className="space-y-6">
                            <FormRow label="Item Title"><input type="text" value={formState.title} onChange={e => handleInputChange('title', e.target.value)} readOnly={isReadOnly} className={inputClassName} /></FormRow>
                            
                            <CollapsibleSection title="Learning Objectives">
                                <div className="space-y-2">
                                    {courseLearningObjectives.map(lo => (
                                        <label key={lo.id} className="flex items-center space-x-3 text-sm">
                                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked={suggestion.learningObjective?.includes(lo.id)} />
                                            <span className="text-gray-700">{lo.id} – {lo.text}</span>
                                        </label>
                                    ))}
                                </div>
                                <button className="text-sm font-semibold text-blue-600 mt-3">+ Add alignment</button>
                            </CollapsibleSection>

                            <div className="grid grid-cols-2 gap-6">
                                <FormRow label="Estimated duration (min)"><input type="number" value={formState.duration} onChange={e => handleInputChange('duration', e.target.value)} readOnly={isReadOnly} className={inputClassName} /></FormRow>
                                <FormRow label="Difficulty"><select value={formState.difficulty} onChange={e => handleInputChange('difficulty', e.target.value)} className={inputClassName} disabled={isReadOnly}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></FormRow>
                            </div>

                            <FormRow label="Tone / Format">
                                <div className="flex space-x-4">
                                    {['Instructional', 'Conversational', 'Scenario-based'].map(tone => (
                                        <label key={tone} className="flex items-center space-x-2"><input type="radio" name="tone" value={tone} checked={formState.tone === tone} onChange={e => handleInputChange('tone', e.target.value)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" /><span>{tone}</span></label>
                                    ))}
                                </div>
                            </FormRow>

                            <CollapsibleSection title="Content Details" defaultOpen={true}>
                              {renderTypeSpecificFields()}
                            </CollapsibleSection>
                            
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center"><SparklesIcon className="w-5 h-5 mr-2 text-blue-600"/>AI Assist</h3>
                                <div className="flex items-center space-x-2">
                                    {['Regenerate', 'Rewrite Tone', 'Shorten / Expand', 'Improve Clarity'].map(action => (
                                        <button key={action} className="text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-md px-3 py-1.5 hover:bg-blue-100">{action}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                     {activeTab === 'preview' ? (() => {
                        switch (suggestion.type) {
                            case 'Dialogue':
                                return (
                                    <div className="p-6 bg-gray-50 rounded-md border">
                                        <h4 className="font-semibold text-center mb-4 text-gray-700">Conversation Preview</h4>
                                        <div className="max-w-2xl mx-auto p-4">
                                            <p className="text-xs text-gray-500 text-center mb-4">This is a simulation of the conversation flow.</p>
                                            <div className="text-sm text-gray-600 bg-white border p-3 rounded-md mb-4 shadow-sm">
                                                <p className="font-semibold mb-1">Prompt:</p>
                                                <p>{formState.description}</p>
                                            </div>
                                            {dialoguePreviewConversation.map((turn, index) => (
                                                <ChatBubble
                                                    key={index}
                                                    message={turn.text}
                                                    isLearner={turn.speaker === 'learner'}
                                                    avatar={turn.speaker === 'learner' ? 'You' : getAvatar(formState.aiPersona)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            case 'Role Play':
                                return (
                                    <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-md border">
                                        <div>
                                            <h4 className="font-semibold text-center mb-4 text-gray-700">Dialogue Script</h4>
                                            <div className="p-2">
                                                <ChatBubble message="Good morning. Thanks for meeting with me. I wanted to update you on the Q3 marketing campaign." isLearner={true} avatar="You" />
                                                <ChatBubble message="Morning. Let's hear it. I've got some concerns about the budget." isLearner={false} avatar="SS" />
                                                <ChatBubble message="I understand. We're currently on track with spending, and I can walk you through the latest performance metrics which show a strong ROI." isLearner={true} avatar="You" />
                                            </div>
                                        </div>
                                        <div className="border-l pl-6">
                                            <h4 className="font-semibold text-center mb-4 text-gray-700">Evaluation Criteria</h4>
                                            <div className="p-4 bg-white rounded-md border shadow-sm">
                                                <ul className="space-y-3 text-sm">
                                                {(formState.assessment || '').split('\n').map((item: string, index: number) => (
                                                    item && <li key={index} className="flex items-center"><span className="w-4 h-4 rounded-full border border-gray-400 mr-3 shrink-0"></span><span className="text-gray-700">{item}</span></li>
                                                ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                );
                            case 'Tools-based Lab':
                                return (
                                    <div className="grid grid-cols-2 gap-8 p-4 bg-gray-50 rounded-md border">
                                        {/* Left Column */}
                                        <div className="space-y-6">
                                            {/* Task Summary */}
                                            <div className="bg-white p-4 rounded-md border shadow-sm">
                                                <h4 className="font-semibold text-gray-800 mb-3">🔹 Task Summary</h4>
                                                <div className="mb-3">
                                                    <h5 className="font-semibold text-sm mb-1">🧩 Lab Objective</h5>
                                                    <p className="text-sm text-gray-600">Practice building a data-visualization dashboard using Tableau.</p>
                                                </div>
                                                <div className="mb-3">
                                                    <h5 className="font-semibold text-sm mb-1">🪜 Steps Overview</h5>
                                                    <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                                                        <li>Open the Tableau workspace.</li>
                                                        <li>Connect to the sample dataset (sales.csv).</li>
                                                        <li>Create a bar chart showing revenue by region.</li>
                                                        <li>Export your dashboard as “Q3_Report.twbx”.</li>
                                                    </ol>
                                                </div>
                                                <div className="flex items-center space-x-3 text-xs">
                                                    <span className="bg-gray-100 px-2 py-1 rounded">~20 minutes</span>
                                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium">Intermediate</span>
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">Tableau</span>
                                                </div>
                                            </div>

                                            {/* Embedded Environment */}
                                            <div>
                                                <button className="w-full text-left font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-md px-4 py-2 hover:bg-blue-100 mb-2">
                                                    [ Launch Lab Environment → ]
                                                </button>
                                                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-gray-500 text-sm bg-gray-100">
                                                    <p className="font-semibold text-center mb-2">Code / Design Environment</p>
                                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                                        <li>File explorer (sales.csv)</li>
                                                        <li>Script area or canvas</li>
                                                        <li>Output / preview window</li>
                                                    </ul>
                                                </div>
                                                <p className="text-xs text-gray-500 text-center mt-2">
                                                    In the live course, learners complete the task directly in this embedded workspace.
                                                </p>
                                            </div>
                                            
                                            {/* Deliverable & Submission */}
                                            <div className="bg-white p-4 rounded-md border shadow-sm">
                                                <h5 className="font-semibold text-sm mb-2">📦 Deliverable</h5>
                                                <p className="text-sm text-gray-600 mb-4">Upload your completed dashboard (.twbx) or confirm auto-save in workspace.</p>
                                                <h5 className="font-semibold text-sm mb-2">✅ Submission Requirements</h5>
                                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-4 ml-4">
                                                    <li>Chart includes at least 3 regions</li>
                                                    <li>Dashboard title is visible</li>
                                                    <li>Total revenue displayed correctly</li>
                                                </ul>
                                                <button className="w-full font-semibold text-white bg-blue-600 rounded-md px-4 py-2 hover:bg-blue-700">
                                                    [ Submit Lab ]
                                                </button>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="border-l pl-8">
                                            <h4 className="font-semibold text-center mb-4 text-gray-700">Feedback & Evaluation Criteria</h4>
                                            <div className="p-4 bg-white rounded-md border shadow-sm space-y-3">
                                                <div className="grid grid-cols-3 gap-2 text-sm font-semibold text-gray-500 border-b pb-2">
                                                    <div className="col-span-1">Criterion</div>
                                                    <div className="col-span-2">Description</div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-sm text-gray-700 items-center">
                                                    <div className="col-span-1 font-semibold">Accuracy</div>
                                                    <div className="col-span-2">Output matches dataset expectations.</div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-sm text-gray-700 items-center">
                                                    <div className="col-span-1 font-semibold">Completeness</div>
                                                    <div className="col-span-2">All required elements implemented.</div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-sm text-gray-700 items-center">
                                                    <div className="col-span-1 font-semibold">Presentation</div>
                                                    <div className="col-span-2">Layout readable, labels clear.</div>
                                                </div>
                                                <div className="pt-3 border-t mt-3">
                                                    <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">
                                                        See exemplar output →
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            default:
                                return <div className="p-6 bg-gray-50 rounded-md border min-h-[300px] flex flex-col items-center justify-center"><h4 className="font-semibold text-lg text-gray-500">Learner Preview</h4><p className="text-center text-gray-400 mt-2">A preview of what the learner will see would be rendered here.</p></div>;
                        }
                    })() : null}
                    
                    {activeTab === 'edit' && isReadOnly && (
                        <div className="p-6 bg-gray-50 rounded-md border min-h-[300px]"><h4 className="font-semibold text-lg text-center text-gray-500 mt-20">Read-only View</h4><p className="text-center text-gray-400">Switch to the Learner Preview tab to see the content.</p></div>
                    )}

                    {activeTab === 'pedagogy' && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h3 className="text-base font-semibold text-gray-800 mb-2">Pedagogy Evaluation Summary</h3>
                                <div className="flex items-center space-x-6 text-sm">
                                    <div className="flex items-center space-x-2 text-green-600 font-semibold">
                                        <CheckCircleIcon className="w-5 h-5" />
                                        <span>{passedCount} checks passed</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-orange-600 font-semibold">
                                        <WarningIcon className="w-5 h-5" />
                                        <span>{warningCount} warnings</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-red-600 font-semibold">
                                        <XCircleIcon className="w-5 h-5" />
                                        <span>{criticalCount} critical issues</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-3">Based on Coursera’s pedagogical model and engagement benchmarks (v2.3).</p>
                            </div>

                            <div>
                                <div className="flex justify-between items-center text-sm mb-1.5">
                                    <span className="font-semibold text-gray-700">Pedagogical Quality Score</span>
                                    <span className="font-bold text-gray-800">{suggestion.qualityScore} / 100</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${suggestion.qualityScore}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5 text-right">Calculated using Coursera Quality Engine v2.3.</p>
                            </div>
                            
                            <div className="space-y-4">
                                {Object.entries(pedagogyChecksData).map(([category, checks]) => (
                                    <div key={category}>
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b">{category}</h4>
                                        <div className="space-y-3">
                                            {checks.map((check, index) => {
                                                const Icon = check.status === 'passed' ? CheckCircleIcon : check.status === 'warning' ? WarningIcon : XCircleIcon;
                                                const colorClass = check.status === 'passed' ? 'text-green-600' : check.status === 'warning' ? 'text-orange-600' : 'text-red-600';

                                                return (
                                                    <div key={index} className="flex items-start justify-between p-3 rounded-md bg-white border border-gray-200 hover:border-gray-300">
                                                        <div className="flex items-start">
                                                            <Icon className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${colorClass}`} />
                                                            <p className="text-sm text-gray-700">{check.message}</p>
                                                        </div>
                                                        {check.aiFix && (
                                                            <button className="ml-4 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-md px-3 py-1 hover:bg-blue-100 whitespace-nowrap flex items-center space-x-1.5">
                                                                <SparklesIcon className="w-4 h-4" />
                                                                <span>AI Fix</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>

                <footer className="px-6 py-4 bg-gray-50 flex justify-between items-center rounded-b-lg flex-shrink-0 border-t">
                    {isReadOnly ? (
                        <div className="flex justify-end w-full">
                            <button onClick={onClose} className="font-semibold text-gray-700 bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100">Close</button>
                        </div>
                    ) : (
                        <>
                            <button onClick={onClose} className="font-semibold text-gray-700 hover:text-gray-900">Cancel</button>
                            <div className="flex items-center space-x-3">
                                <button className="font-semibold text-blue-600 bg-white border border-blue-600 rounded-md px-4 py-2 hover:bg-blue-50">Regenerate All</button>
                                <button onClick={handleSave} className="font-semibold text-white bg-blue-600 rounded-md px-4 py-2 hover:bg-blue-700">Save & Return</button>
                            </div>
                        </>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default SuggestionPreviewModal;