export interface User{
  user_id: string,
  user_name: string,
  user_correo: string,
  password: string,
  role: 'user' | 'admin';
  is_active: boolean;
}
