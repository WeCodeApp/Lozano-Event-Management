import { defineStore } from "pinia";
import { mockUsers } from "../mock-store";

export const useUserStore = defineStore("user", {
  state: () => {
    // Start with the mock users
    const users = [...mockUsers];
    let currentUser = null;
    let isAuthenticated = false;

    // Try to load stored user data
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const storedUser = JSON.parse(userData);

        // Find the user in our users array
        const userIndex = users.findIndex((u) => u.id === storedUser.id);

        if (userIndex !== -1) {
          // Update our in-memory user with the stored events joined
          // This is the key fix - we use the localStorage eventsJoined data
          users[userIndex].eventsJoined = storedUser.eventsJoined || [];
          currentUser = users[userIndex];
          isAuthenticated = true;
        }
      }
    } catch (e) {
      console.warn("Failed to load user data from localStorage:", e);
    }

    return {
      users,
      currentUser,
      isAuthenticated,
    };
  },

  getters: {
    isAdmin: (state) => state.currentUser?.isAdmin || false,
    joinedEvents: (state) => state.currentUser?.eventsJoined || [],
  },

  actions: {
    login(username, password) {
      const user = this.users.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        this.currentUser = user;
        this.isAuthenticated = true;

        try {
          localStorage.setItem("user", JSON.stringify(user));
        } catch (e) {
          console.warn("Failed to save user to localStorage:", e);
        }

        return true;
      }
      return false;
    },

    logout() {
      this.currentUser = null;
      this.isAuthenticated = false;

      try {
        localStorage.removeItem("user");
      } catch (e) {
        console.warn("Failed to remove user from localStorage:", e);
      }
    },

    checkAuth() {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const storedUser = JSON.parse(userData);
          const userIndex = this.users.findIndex((u) => u.id === storedUser.id);

          if (userIndex !== -1) {
            // Important: Use the eventsJoined data from localStorage
            this.users[userIndex].eventsJoined = storedUser.eventsJoined || [];
            this.currentUser = this.users[userIndex];
            this.isAuthenticated = true;
            return true;
          }
        }
      } catch (e) {
        console.warn("Error checking authentication:", e);
      }

      this.currentUser = null;
      this.isAuthenticated = false;
      return false;
    },

    joinEvent(eventId) {
      if (!this.currentUser) return false;

      if (!this.currentUser.eventsJoined) {
        this.currentUser.eventsJoined = [];
      }

      if (!this.currentUser.eventsJoined.includes(eventId)) {
        this.currentUser.eventsJoined.push(eventId);

        // Update the user in the users array
        const userIndex = this.users.findIndex(
          (u) => u.id === this.currentUser.id
        );
        if (userIndex !== -1) {
          this.users[userIndex] = this.currentUser;
        }

        try {
          localStorage.setItem("user", JSON.stringify(this.currentUser));
        } catch (e) {
          console.warn("Failed to save user data to localStorage:", e);
        }

        return true;
      }

      return false;
    },

    leaveEvent(eventId) {
      if (!this.currentUser || !this.currentUser.eventsJoined) return false;

      const index = this.currentUser.eventsJoined.indexOf(eventId);
      if (index !== -1) {
        this.currentUser.eventsJoined.splice(index, 1);

        // Update the user in the users array
        const userIndex = this.users.findIndex(
          (u) => u.id === this.currentUser.id
        );
        if (userIndex !== -1) {
          this.users[userIndex] = this.currentUser;
        }

        try {
          localStorage.setItem("user", JSON.stringify(this.currentUser));
        } catch (e) {
          console.warn("Failed to save user data to localStorage:", e);
        }

        return true;
      }

      return false;
    },
  },
});
