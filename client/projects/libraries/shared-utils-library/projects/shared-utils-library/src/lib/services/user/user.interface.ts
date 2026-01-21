export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Operador' | 'Auditor';
  permissions: string[];
  lastLogin: Date;
}
