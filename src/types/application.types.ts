// types/application.types.ts
export interface Education {
  degree: string;
  institution: string;
  graduationYear: number;
}

export interface Reference {
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
  _id?: string;
}

export interface Application {
  _id: string;
  JobID: string;
  JobTitle: string;
  CandidateName: string;
  Email: string;
  Phone: string;
  CurrentLocation: string;
  WillingToRelocate: boolean;
  ExpectedSalary: number;
  NoticePeriod: string;
  YearsOfExperience: number;
  Education: Education;
  LinkedInURL: string;
  PortfolioURL: string;
  CoverLetter: string;
  ResumeFileName: string;
  ResumeURL: string;
  CustomAnswers: Record<string, string>;
  Skills: string[];
  References: Reference[];
  Source: string;
  Notes: string;
  ApplicationStatus: string;
  AppliedDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApplicationsApiResponse {
  data: Application[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}