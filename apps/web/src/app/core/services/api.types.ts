export type UserRole = 'CUSTOMER' | 'LAWYER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profilePhoto?: string;
}

export interface PracticeArea {
  id: string;
  name: string;
  description: string;
}

export interface Lawyer {
  id: string;
  user: User;
  city: string;
  experience: number;
  consultationFee: string | number;
  bio: string;
  languages: string[];
  practiceAreas: PracticeArea[];
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  educations?: { degree: string; institute: string; year: number }[];
  experiences?: { title: string; institution: string; years: number }[];
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer: { name: string; profilePhoto?: string };
}

export interface Consultation {
  id: string;
  consultationDate: string;
  status: string;
  notes?: string;
  paymentStatus: string;
  lawyer: Lawyer;
  customer: User;
}
