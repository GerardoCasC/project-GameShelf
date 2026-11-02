export interface User {
  id: string;
  username: string;
  email: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface SigninResponse {
  token: string;
}
