// Test credentials for different user types
export const credentials = {
  // Client accounts
  client: {
    valid: {
      email: 'client@test.com',
      password: 'password123'
    },
    invalid: {
      email: 'client@test.com',
      password: 'wrongpassword'
    }
  },
  
  // Cleaner accounts
  cleaner: {
    verified: {
      email: 'cleaner@test.com',
      password: 'cleaner123'
    },
    unverified: {
      email: 'unverified-cleaner@test.com',
      password: 'password123'
    },
    suspended: {
      email: 'suspended-cleaner@test.com',
      password: 'password123'
    }
  },
  
  // Admin accounts
  admin: {
    regular: {
      email: 'admin@scrub.com',
      password: 'admin123'
    },
    super: {
      email: 'superadmin@scrub.com',
      password: 'superadmin123'
    },
    moderator: {
      email: 'moderator@scrub.com',
      password: 'moderator123'
    }
  }
};

// Invalid test data
export const invalidCredentials = {
  invalidEmail: 'invalid-email',
  emptyEmail: '',
  emptyPassword: '',
  sqlInjection: "admin@test.com'; DROP TABLE users; --"
};

// Test URLs
export const urls = {
  login: 'http://localhost:5000/sign-in',
  signup: 'http://localhost:5000/sign-up',
  forgotPassword: 'http://localhost:5000/forgot-password',
  clientDashboard: 'http://localhost:5000/dashboard',
  cleanerDashboard: 'http://localhost:5000/cleaner-dashboard',
  adminDashboard: 'http://localhost:5000/admin-dashboard'
};

// Test data for booking services
export const bookingData = {
  serviceType: 'Deep Cleaning',
  location: 'Makati City',
  date: '2024-12-25',
  time: '10:00 AM',
  duration: '3 hours'
};
