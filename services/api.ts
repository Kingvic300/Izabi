import { API_BASE_URL } from '../constants';
import { User } from '../types';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const sendVerificationOtp = async (userData: { email: string; password: string; role: string }) => {
  const response = await fetch(`${API_BASE_URL}/users/send-verification-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const registerUser = async (userData: { name: string; email: string; otp: string; role: string }) => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const loginUser = async (credentials: { email: string; password: string; role: string }): Promise<{ token: string; user: User }> => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const voiceLogin = async (formData: FormData): Promise<{ token: string; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/users/voice-login`, {
        method: 'POST',
        body: formData,
    });
    return handleResponse(response);
};


export const getUserProfile = async (userId: string, token: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`
    },
  });
  return handleResponse(response);
};

export const generateStudyMaterial = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/v1/study/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  return handleResponse(response);
};