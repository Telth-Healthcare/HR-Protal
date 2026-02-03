import { Application } from "../types/application.types";
import axiosInstance from "./axios";



export const applicationApi = {
    getApplication : async (): Promise<Application[]> => {
        const response = await axiosInstance.get<Application[]>('/careers/Applicationlists');
    return response.data;
    }
} 

export const uploadResume = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(
    "/storage/upload-resume",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.fileId;
};

/**
 * GET resume web URL from fileId
 */
export const getResumeUrl = async (
  fileId: string
): Promise<string> => {
  const response = await axiosInstance.get(
    `/storage/file-url/${fileId}`
  );
  return response.data.url;
};

/**
 * POST submit application
 */
export const submitApplication = async (
  payload: ApplicationPayload
): Promise<Application> => {
  const response = await axiosInstance.post(
    "/careers/submitapplication",
    payload
  );
  return response.data;
};

