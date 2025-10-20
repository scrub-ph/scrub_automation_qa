// TypeScript interfaces for type safety

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'cleaner' | 'admin';
  password?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TestUser extends User {
  isTestUser: boolean;
  createdAt: Date;
}

export interface DatabaseUser {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface LoginTestData {
  validUsers: User[];
  invalidCredentials: LoginCredentials[];
  securityTestCases: LoginCredentials[];
}
