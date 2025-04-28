<template>
  <div>
    <NavBar />
    <div class="container">
      <h1>Welcome to Event Management App</h1>
      <p v-if="userStore.isAuthenticated">
        Hello, {{ userStore.currentUser?.username }}! Navigate to Events to
        manage your events.
      </p>
      <p v-else>
        Please <router-link to="/login">login</router-link> to manage events.
      </p>

      <div class="card" v-if="userStore.isAuthenticated">
        <h2>Quick Stats</h2>
        <p>Total Events: {{ eventStore.events.length }}</p>
        <p>Your Events: {{ userStore.joinedEvents.length }}</p>
        <div class="btn-group">
          <router-link to="/events">
            <button>View Events</button>
          </router-link>
          <router-link v-if="userStore.isAdmin" to="/events/add">
            <button class="secondary">Add New Event</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "../stores/userStore";
import { useEventStore } from "../stores/eventStore";
import NavBar from "../components/NavBar.vue";

const userStore = useUserStore();
const eventStore = useEventStore();
</script>
