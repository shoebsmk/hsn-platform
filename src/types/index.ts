export type UserRole = 'seeker' | 'provider' | 'mentor'

export type OpportunityCategory =
  | 'hidden_jobs'
  | 'community'
  | 'gig_services'
  | 'business'
  | 'income'
  | 'career_guidance'
  | 'mentorship'

export type OpportunityStatus = 'pending' | 'active' | 'verified' | 'rejected' | 'closed' | 'flagged' | 'expired'

export type Location = 'hyderabad' | 'chicago' | 'remote'

export type GuidanceCategory = 'islamic_finance' | 'career' | 'business' | 'community' | 'general'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  location: Location
  bio?: string
  avatar_url?: string
  is_admin?: boolean
  created_at: string
}

export interface Opportunity {
  id: string
  title: string
  description: string
  category: OpportunityCategory
  location: Location
  status: OpportunityStatus
  provider_id: string
  provider?: Profile
  contact_info?: string
  external_url?: string
  is_remote: boolean
  created_at: string
  updated_at: string
}

export interface GuidanceArticle {
  id: string
  title: string
  content: string
  category: GuidanceCategory
  published: boolean
  author_id?: string
  author?: Profile
  created_at: string
  updated_at: string
}

export interface Announcement {
  id: string
  message: string
  active: boolean
  location_target: 'all' | 'hyderabad' | 'chicago'
  created_at: string
}

export type BusinessCategory = 'restaurant' | 'grocery' | 'catering' | 'services' | 'finance' | 'education' | 'health' | 'other'
export type BusinessStatus = 'pending' | 'active' | 'rejected'

export interface Business {
  id: string
  name: string
  description: string
  category: BusinessCategory
  location: Location
  address?: string
  phone?: string
  website?: string
  is_verified: boolean
  status: BusinessStatus
  submitted_by?: string
  submitter?: Profile
  created_at: string
  updated_at: string
}

export interface MentorProfile {
  id: string
  profile_id: string
  profile?: Profile
  expertise: string[]
  industries: string[]
  availability: string
  bio: string
  is_verified: boolean
}
