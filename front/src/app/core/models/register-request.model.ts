export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  role: 'CLIENT' | 'SAV';
}
