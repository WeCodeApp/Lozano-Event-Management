<template>
    <div>
      <NavBar />
      <div class="container">
        <h1>Edit Event</h1>
        
        <div v-if="loading" class="card">
          <p>Loading event details...</p>
        </div>
        
        <div v-else-if="!event" class="card">
          <p>Event not found.</p>
          <router-link to="/events">
            <button>Back to Events</button>
          </router-link>
        </div>
        
        <div v-else class="form-container card">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">Event Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="eventForm.name" 
                required
                placeholder="Enter event name"
              />
            </div>
            
            <div class="form-group">
              <label for="date">Event Date</label>
              <input 
                type="date" 
                id="date" 
                v-model="eventForm.date" 
                required
              />
            </div>
            
            <div class="btn-group">
              <button type="submit">Update Event</button>
              <router-link to="/events">
                <button type="button" class="secondary">Cancel</button>
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useEventStore } from '../stores/eventStore';
  import NavBar from '../components/NavBar.vue';
  
  const route = useRoute();
  const router = useRouter();
  const eventStore = useEventStore();
  
  const loading = ref(true);
  const eventForm = ref({
    name: '',
    date: ''
  });
  
  const eventId = computed(() => parseInt(route.params.id));
  
  const event = computed(() => {
    return eventStore.getEventById(eventId.value);
  });
  
  const loadEventData = () => {
    if (event.value) {
      eventForm.value = {
        name: event.value.name,
        date: event.value.date
      };
    }
  };
  
  const handleSubmit = () => {
    if (eventStore.updateEvent({
      id: eventId.value,
      name: eventForm.value.name,
      date: eventForm.value.date
    })) {
      // Set notification in session storage to be shown on events page
      sessionStorage.setItem('notification', JSON.stringify({
        message: 'Event successfully updated',
        type: 'success'
      }));
      
      router.push(`/events/${eventId.value}`);
    }
  };
  
  watch(event, () => {
    if (event.value) {
      loadEventData();
    }
  });
  
  onMounted(() => {
    // Simulate loading
    setTimeout(() => {
      loading.value = false;
      loadEventData();
    }, 300);
  });
  </script>