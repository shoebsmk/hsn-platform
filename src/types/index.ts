export type UserRole = 'seeker' | 'provider' | 'mentor'

export type OpportunityCategory =
  | 'hidden_jobs'
  | 'community'
  | 'gig_services'
  | 'business'
  | 'income'
  | 'career_guidance'
  | 'mentorship'

export type OpportunityStatus = 'pending' | 'verified' | 'rejected'

export type Location = 'hyderabad' | 'chicago' | 'remote'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  location: Location
  bio?: string
  avatar_url?: string
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
