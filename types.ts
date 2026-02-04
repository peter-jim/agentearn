
export interface AgentSkill {
  name: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT';
  parameters: Record<string, string>;
}

export interface ProjectReview {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount?: number;
  unhelpfulCount?: number;
  verified?: boolean;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export type ReviewSortOption = 'newest' | 'helpful' | 'highest' | 'lowest';
export type ReviewFilterOption = 'all' | '5' | '4' | '3' | '2' | '1';

export interface ExternalLink {
  label: string;
  url: string;
  iconType: 'web' | 'docs' | 'discord' | 'github';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  rating: number;
  earningsPerTask: string;
  totalPayout: string;
  activeAgents: number;
  isSponsored?: boolean;
  rules: string[];
  whyItEarns: string;
  skills: AgentSkill[];
  icon: string;
  popularity: number;
  externalLinks: ExternalLink[];
  reviews: ProjectReview[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
