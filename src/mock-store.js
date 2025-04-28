export const mockUsers = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    isAdmin: true,
    eventsJoined: [], // This is already correct
  },
  {
    id: 2,
    username: "user",
    password: "user123",
    isAdmin: false,
    eventsJoined: [],
  },
];

export const mockEvents = [
  {
    id: 1,
    name: "Tech Conference 2025",
    date: "2025-06-15",
    participants: [],
  },
  {
    id: 2,
    name: "Vue.js Meetup",
    date: "2025-05-20",
    participants: [], // Remove admin (ID 1) from here
  },
];
