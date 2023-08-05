export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  isDeleting?: boolean;
}
