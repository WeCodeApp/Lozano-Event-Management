<template>
    <nav class="nav">
      <div class="nav-content">
        <router-link to="/" class="nav-brand">
          <img src="../assets/logo.svg" alt="Logo" width="24" height="24" />
          Event Manager
        </router-link>
        
        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          
          <template v-if="userStore.isAuthenticated">
            <router-link to="/events" class="nav-link">Events</router-link>
            <a href="#" class="nav-link" @click.prevent="logout">Logout</a>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link">Login</router-link>
          </template>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { useUserStore } from '../stores/userStore';
  
  const router = useRouter();
  const userStore = useUserStore();
  
  const logout = () => {
    userStore.logout();
    router.push('/login');
  };
  </script>
  
  <style scoped>
  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .nav-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: bold;
    color: var(--primary-color);
  }
  
  .nav-links {
    display: flex;
    gap: 20px;
  }
  
  .nav-link {
    color: var(--text-color);
    text-decoration: none;
  }
  
  .nav-link:hover {
    color: var(--primary-color);
  }
  </style>