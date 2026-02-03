export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  user: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
