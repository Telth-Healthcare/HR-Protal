export interface Location {
  city: string;
  country: string;
  type: string;
}

export interface SalaryRange {
  min: number;
  max: number;
}

export interface Job {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  department: string;
  type: string;
  experience: string;
  requirements: string[];
  locations: Location[];
  salaryRange: SalaryRange;
  closingDate: string;
  status: string;
  posterLink: string;
  sites: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface JobFormData {
  title: string;
  description: string;
  department: string;
  type: string;
  experience: string;
  requirements: string[];
  locations: Location[];
  salaryRange: SalaryRange;
  closingDate: string;
  status: string;
  posterLink: string;
  sites: string[];
}
