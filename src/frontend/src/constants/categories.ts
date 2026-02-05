export const CATEGORIES = [
  'Digital Creators',
  'Video & Photography',
  'Music & Performances',
  'Brand & Commerce',
  'Communities',
  'Fitness & Coaching',
  'Travel & Real Estate',
  'Fashion',
  'Food',
  'Clothing',
  'Design',
  'Tech & Gaming',
  'Influencers & Bloggers',
] as const;

export type CategoryType = typeof CATEGORIES[number];
