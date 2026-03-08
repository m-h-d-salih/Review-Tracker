export type ReviewType = 'review' | 'session' | 'group_session' | 'group_project';

export interface Review {
  id: string;
  intern_name: string;
  type: ReviewType;
  advisor_name: string;
  review_date: string;
  notes?: string;
  created_at: string;
}

export interface ReviewStats {
  total_review: number;
  total_session: number;
  total_group_session: number;
  total_group_project: number;
}

export const REVIEW_TYPE_LABELS: Record<ReviewType, string> = {
  review: 'Review',
  session: 'Single Session',
  group_session: 'Group Session',
  group_project: 'Group Project',
};

export const REVIEW_TYPE_OPTIONS: { value: ReviewType; label: string }[] = [
  { value: 'review',        label: 'Review' },
  { value: 'session',       label: 'Single Session' },
  { value: 'group_session', label: 'Group Session' },
  { value: 'group_project', label: 'Group Project' },
];
