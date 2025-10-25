// Store dynamically created test accounts
export const createdAccounts = {
  cleaner: {
    email: '',
    password: 'TestPass123!',
    firstName: 'John',
    lastName: 'Cleaner'
  },
  client: {
    email: '',
    password: 'TestPass123!',
    firstName: 'Jane',
    lastName: 'Client'
  },
  admin: {
    email: '',
    password: 'TestPass123!',
    firstName: 'Admin',
    lastName: 'User'
  }
};

// Function to generate unique email
export function generateUniqueEmail(userType: string): string {
  return `${userType}-test-${Date.now()}@test.com`;
}

// Function to update created account
export function updateCreatedAccount(userType: 'cleaner' | 'client' | 'admin', email: string) {
  createdAccounts[userType].email = email;
}
