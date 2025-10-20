export const LoginTestData = {
  validClients: {
    sarah: {
      email: 'sarah.johnson@email.com',
      password: 'SecurePass123!',
      name: 'Sarah Johnson'
    },
    maria: {
      email: 'maria.garcia@email.com', 
      password: 'MyPassword456!',
      name: 'Maria Garcia'
    },
    patricia: {
      email: 'patricia.security@email.com',
      password: 'SecurePass123!',
      name: 'Patricia Security'
    }
  },

  validCleaners: {
    james: {
      email: 'james.wilson@cleanpro.com',
      password: 'CleanerPass789!',
      name: 'James Wilson'
    },
    lisa: {
      email: 'lisa.chen@scrubteam.com',
      password: 'ExpertCleaner2024!',
      name: 'Lisa Chen'
    }
  },

  invalidCredentials: {
    emma: {
      email: 'emma.davis@email.com',
      password: 'WrongPassword123',
      name: 'Emma Davis'
    },
    robert: {
      email: 'robert.nonexistent@email.com',
      password: 'SomePassword123!',
      name: 'Robert Nonexistent'
    },
    michael: {
      email: 'michael.invalid-email-format',
      password: 'ValidPass123!',
      name: 'Michael Invalid'
    }
  },

  suspendedAccounts: {
    david: {
      email: 'david.expired@cleanservice.com',
      password: 'ExpiredPass456!',
      name: 'David Expired'
    },
    amanda: {
      email: 'amanda.suspended@cleanteam.com',
      password: 'CleanerPass789!',
      name: 'Amanda Suspended'
    }
  },

  securityTests: {
    sophie: {
      email: "admin'; DROP TABLE users; --",
      password: "' OR '1'='1",
      name: 'Sophie SQL Injection'
    },
    thomas: {
      email: 'thomas.ratelimit@email.com',
      password: 'WrongPassword123',
      name: 'Thomas Rate Limit'
    }
  }
};
