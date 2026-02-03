import axiosInstance from './axios';
import { Job, JobFormData } from '../types/job.types';

export const jobsApi = {
  getJobs: async (): Promise<Job[]> => {
    const response = await axiosInstance.get<Job[]>('/jobpost/getposts');
    return response.data;
  },
    getJobId: async (jobId): Promise<Job[]> => {
    const response = await axiosInstance.get<Job[]>(`/jobpost/getpostid/${jobId}`);
    return response.data;
  },
  createJob: async (payload: JobFormData): Promise<Job> => {
    const response = await axiosInstance.post<Job>('/jobpost/createpost', payload);
    return response.data;
  },

  updateJob: async (id: string, payload: JobFormData): Promise<Job> => {
    const response = await axiosInstance.put<Job>(`/jobpost/updatepost/${id}`, payload);
    return response.data;
  },

  deleteJob: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/jobpost/deletepost/${id}`);
  },
};
