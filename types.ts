export interface Course {
  id: number;
  title: string;
  enrollments: number;
  session: string;
  sessionDate: string;
  status: 'Live';
  associatedWith: string;
  imageUrl?: string;
  engagement?: number;
  completion?: number;
  potentialLift?: number;
  engagementTrend?: number;
}

export interface Suggestion {
  id: number;
  type: 'Practice Assignment' | 'Graded Assignment' | 'Dialogue' | 'Role Play' | 'Tools-based Lab';
  title: string;
  learningObjective?: string;
  engagementLift: number;
  qualityScore: number;
  rationale: string;
  rationaleTooltip: string;
  defaultOpen?: boolean;
  status?: 'pending' | 'review' | 'accepted' | 'dismissed';
  moduleNumber: number;
  modelConfidence?: number;
}