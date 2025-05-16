<template>
  <div class="login-page">
    <div class="login-container">
      <div v-if="authStore.hasError" class="login-error">
        {{ authStore.error }}
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-field">
          <input 
            id="username" 
            v-model="username" 
            type="text" 
            required 
            placeholder="Логин или email"
            class="login-input"
          />
        </div>
        
        <div class="form-field">
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            required 
            placeholder="Пароль"
            class="login-input"
          />
        </div>
        
        <button type="submit" class="login-button" :disabled="isLoading">
          {{ isLoading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

// Define custom layout for login page
definePageMeta({
  layout: 'auth'
});

const authStore = useAuthStore();
const username = ref('');
const password = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  
  try {
    const success = await authStore.login(username.value, password.value);
    
    if (success) {
      // Navigate to dashboard on successful login
      navigateTo('/');
    }
  } catch (error) {
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1a1a23;
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: $spacing-lg;
}

.login-error {
  color: #e74c3c;
  margin-bottom: $spacing-md;
  text-align: center;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.form-field {
  width: 100%;
}

.login-input {
  width: 100%;
  padding: 16px 20px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #1e1e2d;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.05);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
}

.login-button {
  width: 100%;
  padding: 16px;
  border-radius: 30px;
  border: none;
  background-color: #f5f5f5;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: $spacing-md;
  
  &:hover {
    background-color: white;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}
</style>
