// Test credentials for different user types
export const credentials = {
  client: {
    email: 'client@gmail.com',
    password: 'P@ssword1919'
  },
  cleaner: {
    email: 'cleaner@gmail.com', 
    password: 'P@ssword1919'
  },
  admin: {
    email: 'admin-e2e@test.local',
    password: 'AdminPass!234'
  }
};

export const bookingData = {
  deepCleaning: {
    serviceType: 'Deep Cleaning',
    propertyType: 'House',
    propertySize: '3 Bedroom',
    location: 'Makati City, Metro Manila',
    date: '2024-12-25',
    time: '10:00 AM',
    specialInstructions: 'Please focus on kitchen and bathrooms'
  },
  regularCleaning: {
    serviceType: 'Regular Cleaning',
    propertyType: 'Apartment',
    propertySize: '1 Bedroom',
    location: 'BGC, Taguig',
    date: '2024-11-15',
    time: '2:00 PM'
  }
};
