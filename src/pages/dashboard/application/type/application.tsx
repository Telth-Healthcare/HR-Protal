export interface Education {
  degree: string;
  institution: string;
  graduationYear?: number;
}

export interface Reference {
  name: string;
  position: string;
  company: string;
  phone?: string;
  email?: string;
}

export interface ApplicationPayload {
  JobID: string;
  JobTitle: string;
  CandidateName: string;
  Email: string;
  Phone: string;
  CurrentLocation?: string;
  WillingToRelocate: boolean;
  ExpectedSalary?: number;
  NoticePeriod?: string;
  YearsOfExperience: number;
  Education: Education;
  LinkedInURL?: string;
  PortfolioURL?: string;
  CoverLetter?: string;
  ResumeFileName?: string;
  ResumeURL: string;
  Skills: string[];
  References: Reference[];
  CustomAnswers?: Record<string, any>;
  Notes?: string;
  Source: "Website" | "LinkedIn" | "Referral" | "Job Board" | "Other";
}
