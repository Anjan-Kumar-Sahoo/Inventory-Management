export interface RegisterRequest {
  email: string;
  storeName: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  storeName: string;
}

export interface AuthUser {
  userId: number;
  email: string;
  storeName: string;
}
