import { defineStore } from 'pinia';
import users from '~/data/users.json';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    error: null
  }),
  
  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    hasError: (state) => state.error !== null
  },
  
  actions: {
    async login(username, password) {
      try {
        // Reset error state
        this.error = null;
        
        // Find user in our JSON data
        const user = users.users.find(
          (u) => u.username === username && u.password === password
        );
        
        if (user) {
          // Create a user object without the password
          const { password, ...userWithoutPassword } = user;
          
          // Set user and authentication state
          this.user = userWithoutPassword;
          this.isAuthenticated = true;
          
          // Store in localStorage for persistence
          if (process.client) {
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          }
          
          return true;
        } else {
          this.error = 'Неверное имя пользователя или пароль';
          return false;
        }
      } catch (error) {
        this.error = 'Произошла ошибка при входе в систему';
        console.error('Login error:', error);
        return false;
      }
    },
    
    logout() {
      this.user = null;
      this.isAuthenticated = false;
      
      // Remove from localStorage
      if (process.client) {
        localStorage.removeItem('user');
      }
    },
    
    initAuth() {
      // Check if we're on the client side
      if (process.client) {
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          try {
            this.user = JSON.parse(storedUser);
            this.isAuthenticated = true;
          } catch (error) {
            console.error('Error parsing stored user:', error);
            this.logout();
          }
        }
      }
    },
    
    clearError() {
      this.error = null;
    }
  }
});
