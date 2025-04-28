<template>
  <div>
    <NavBar />
    <div class="container">
      <div v-if="loading" class="card">
        <p>Loading event details...</p>
      </div>

      <div v-else-if="!event" class="card">
        <p>Event not found.</p>
        <router-link to="/events">
          <button>Back to Events</button>
        </router-link>
      </div>

      <div v-else>
        <div class="event-detail-header">
          <h1>{{ event.name }}</h1>
          <div class="btn-group" v-if="userStore.isAdmin">
            <router-link :to="`/events/${event.id}/edit`">
              <button class="secondary">Edit Event</button>
            </router-link>
            <button class="danger" @click="confirmDelete">Delete Event</button>
          </div>
        </div>

        <div class="card">
          <h2>Event Details</h2>
          <p><strong>Date:</strong> {{ formatDate(event.date) }}</p>
          <p>
            <strong>Participants:</strong>
            {{ event.participants ? event.participants.length : 0 }}
          </p>

          <div class="event-actions">
            <button v-if="!isUserJoined(event.id)" @click="joinEvent(event.id)">
              Join Event
            </button>
            <button v-else class="danger" @click="leaveEvent(event.id)">
              Leave Event
            </button>
          </div>
        </div>

        <div
          class="card"
          v-if="event.participants && event.participants.length > 0"
        >
          <h2>Participants</h2>
          <ul>
            <li v-for="userId in event.participants" :key="userId">
              {{ getUsernameById(userId) }}
            </li>
          </ul>
        </div>

        <div class="btn-group">
          <router-link to="/events">
            <button>Back to Events</button>
          </router-link>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal-content card">
          <h2>Confirm Delete</h2>
          <p>
            Are you sure you want to delete this event? This action cannot be
            undone.
          </p>
          <div class="btn-group">
            <button class="danger" @click="deleteEvent">Delete</button>
            <button @click="showDeleteModal = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { useEventStore } from "../stores/eventStore";
import NavBar from "../components/NavBar.vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const eventStore = useEventStore();

const loading = ref(true);
const showDeleteModal = ref(false);

const eventId = computed(() => parseInt(route.params.id));

const event = computed(() => {
  return eventStore.getEventById(eventId.value);
});

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getUsernameById = (userId) => {
  const user = userStore.users.find((u) => u.id === userId);
  return user ? user.username : "Unknown User";
};

const isUserJoined = (eventId) => {
  const numEventId = Number(eventId);

  // Check both the user's joined events and if the user is in the event's participants
  const event = eventStore.getEventById(numEventId);
  const inEventParticipants = event?.participants?.includes(
    userStore.currentUser?.id
  );
  const inUserJoinedEvents = userStore.joinedEvents?.includes(numEventId);

  console.log(
    `Event ${numEventId}:`,
    `In user's joined events: ${inUserJoinedEvents}`,
    `In event participants: ${inEventParticipants}`
  );

  // Return true if either condition is met
  return inUserJoinedEvents || inEventParticipants;
};

watch(
  () => userStore.joinedEvents,
  (newEvents) => {
    console.log("Joined events changed:", newEvents);
  },
  { deep: true }
);

const joinEvent = (eventId) => {
  // Convert to number for consistency
  const numEventId = Number(eventId);

  if (userStore.joinEvent(numEventId)) {
    // Use addParticipant instead of joinEvent
    eventStore.addParticipant(numEventId, userStore.currentUser.id);
  }
};

const leaveEvent = (eventId) => {
  // Convert to number for consistency
  const numEventId = Number(eventId);

  if (userStore.leaveEvent(numEventId)) {
    // Use removeParticipant instead of leaveEvent
    eventStore.removeParticipant(numEventId, userStore.currentUser.id);
  }
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const deleteEvent = () => {
  if (eventStore.deleteEvent(eventId.value)) {
    try {
      // Set notification in session storage to be shown on events page
      sessionStorage.setItem(
        "notification",
        JSON.stringify({
          message: "Event successfully deleted",
          type: "success",
        })
      );
    } catch (error) {
      console.error("Error setting notification:", error);
    }
    router.push("/events");
  }
};

onMounted(() => {
  // Simulate loading
  setTimeout(() => {
    loading.value = false;
  }, 300);
});
</script>

<style scoped>
.event-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
}
</style>
