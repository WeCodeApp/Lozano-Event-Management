<template>
    <div>
      <NavBar />
      <div class="container">
        <div class="login-form card">
          <h1>Login</h1>
          <div v-if="error" class="alert alert-error">
            {{ error }}
          </div>
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="username">Username</label>
              <input 
                type="text" 
                id="username" 
                v-model="username" 
                required
                placeholder="Enter your username"
              />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                required
                placeholder="Enter your password"
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <p class="mt-3">
            <small>Demo credentials: admin/admin123 or user/user123</small>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '../stores/userStore';
  import NavBar from '../components/NavBar.vue';
  
  const username = ref('');
  const password = ref('');
  const error = ref('');
  const router = useRouter();
  const userStore = useUserStore();
  
  const handleLogin = () => {
    if (userStore.login(username.value, password.value)) {
      router.push('/');
    } else {
      error.value = 'Invalid username or password';
    }
  };
  </script>