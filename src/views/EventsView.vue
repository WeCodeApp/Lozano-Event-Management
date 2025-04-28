<template>
  <div>
    <NavBar />
    <div class="container">
      <div class="events-header">
        <h1>Events</h1>
        <div class="btn-group" v-if="userStore.isAdmin">
          <router-link to="/events/add">
            <button>Add New Event</button>
          </router-link>
        </div>
      </div>

      <div
        v-if="notification"
        class="alert"
        :class="`alert-${notification.type}`"
      >
        {{ notification.message }}
      </div>

      <div v-if="eventStore.events.length === 0" class="card">
        <p>No events available.</p>
      </div>

      <div v-else class="event-grid">
        <div
          v-for="event in eventStore.events"
          :key="event.id"
          class="event-card"
        >
          <div class="event-header">
            <h3>{{ event.name }}</h3>
          </div>
          <div class="event-body">
            <p class="event-date">Date: {{ formatDate(event.date) }}</p>
            <p class="event-participants">
              Participants:
              {{ event.participants ? event.participants.length : 0 }}
            </p>

            <div class="event-actions">
              <router-link :to="`/events/${event.id}`">
                <button class="secondary">View Details</button>
              </router-link>

              <button
                v-if="!isUserJoined(event.id)"
                @click="joinEvent(event.id)"
              >
                Join Event
              </button>
              <button v-else class="danger" @click="leaveEvent(event.id)">
                Leave Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "../stores/userStore";
import { useEventStore } from "../stores/eventStore";
import NavBar from "../components/NavBar.vue";

const userStore = useUserStore();
const eventStore = useEventStore();
const notification = ref(null);
const forceRender = ref(0);

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
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
  const numEventId = Number(eventId);

  if (userStore.joinEvent(numEventId)) {
    eventStore.addParticipant(numEventId, userStore.currentUser.id);
    showNotification("Successfully joined the event", "success");
    // Force component to re-render
    forceRender.value++;
  }
};

const leaveEvent = (eventId) => {
  // Make sure eventId is a number
  const numEventId = Number(eventId);

  if (userStore.leaveEvent(numEventId)) {
    // Use removeParticipant instead of leaveEvent
    eventStore.removeParticipant(numEventId, userStore.currentUser.id);
    showNotification("Successfully left the event", "success");
  }
};

const showNotification = (message, type = "success") => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = null;
  }, 3000);
};

onMounted(() => {
  // Check if we have a notification from another page
  const storedNotification = sessionStorage.getItem("notification");
  if (storedNotification) {
    try {
      notification.value = JSON.parse(storedNotification);
      sessionStorage.removeItem("notification");

      setTimeout(() => {
        notification.value = null;
      }, 3000);
    } catch (error) {
      console.error("Error parsing notification:", error);
    }
  }
});
</script>

<style scoped>
.events-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
