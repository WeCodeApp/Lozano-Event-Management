<template>
    <div>
      <NavBar />
      <div class="container">
        <h1>Add New Event</h1>
        
        <div class="form-container card">
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
              <button type="submit">Create Event</button>
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
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useEventStore } from '../stores/eventStore';
  import NavBar from '../components/NavBar.vue';
  
  const router = useRouter();
  const eventStore = useEventStore();
  
  const eventForm = ref({
    name: '',
    date: new Date().toISOString().split('T')[0] // Today's date as default
  });
  
  const handleSubmit = () => {
    const newEvent = eventStore.addEvent({
      name: eventForm.value.name,
      date: eventForm.value.date
    });
    
    // Set notification in session storage to be shown on events page
    sessionStorage.setItem('notification', JSON.stringify({
      message: 'Event successfully created',
      type: 'success'
    }));
    
    router.push('/events');
  };
  </script>