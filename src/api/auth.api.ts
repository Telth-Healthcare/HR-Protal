import axiosInstance from './axios';
import { SignInPayload, SignUpPayload, AuthResponse } from '../types/auth.types';

export const authApi = {
  signIn: async (payload: SignInPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/signin', payload);
    return response.data;
  },

  signUp: async (payload: SignUpPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/signup', payload);
    return response.data;
  },
};
