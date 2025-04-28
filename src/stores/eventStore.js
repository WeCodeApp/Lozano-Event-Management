import { defineStore } from "pinia";
import { mockEvents } from "../mock-store";

export const useEventStore = defineStore("event", {
  state: () => {
    // First try to load from localStorage
    const storedEvents = localStorage.getItem("events");
    return {
      events: storedEvents ? JSON.parse(storedEvents) : mockEvents,
    };
  },

  getters: {
    getEventById: (state) => (id) => {
      return state.events.find((event) => event.id === id);
    },

    getEventsByParticipant: (state) => (userId) => {
      return state.events.filter(
        (event) => event.participants && event.participants.includes(userId)
      );
    },
  },

  actions: {
    // Save current events to localStorage
    saveEvents() {
      try {
        localStorage.setItem("events", JSON.stringify(this.events));
      } catch (error) {
        console.error("Failed to save events to localStorage:", error);
      }
    },

    addEvent(eventData) {
      const newId = Math.max(0, ...this.events.map((e) => e.id)) + 1;

      const newEvent = {
        id: newId,
        name: eventData.name,
        date: eventData.date,
        participants: eventData.participants || [],
      };

      this.events.push(newEvent);
      this.saveEvents(); // Save to localStorage
      return newEvent;
    },

    updateEvent(id, eventData) {
      const index = this.events.findIndex((event) => event.id === id);

      if (index !== -1) {
        this.events[index] = {
          ...this.events[index],
          name: eventData.name,
          date: eventData.date,
          participants:
            eventData.participants || this.events[index].participants,
        };

        this.saveEvents(); // Save to localStorage
        return true;
      }

      return false;
    },

    deleteEvent(id) {
      const index = this.events.findIndex((event) => event.id === id);

      if (index !== -1) {
        this.events.splice(index, 1);
        this.saveEvents(); // Save to localStorage
        return true;
      }

      return false;
    },

    addParticipant(eventId, userId) {
      const event = this.getEventById(eventId);

      if (event) {
        if (!event.participants) {
          event.participants = [];
        }

        if (!event.participants.includes(userId)) {
          event.participants.push(userId);
          this.saveEvents(); // Save to localStorage
          return true;
        }
      }

      return false;
    },

    removeParticipant(eventId, userId) {
      const event = this.getEventById(eventId);

      if (event && event.participants) {
        const index = event.participants.indexOf(userId);

        if (index !== -1) {
          event.participants.splice(index, 1);
          this.saveEvents(); // Save to localStorage
          return true;
        }
      }

      return false;
    },
  },
});
