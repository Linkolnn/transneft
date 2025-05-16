<template>
  <div class="app-layout">
    <div class="sidebar-toggle" @click="toggleSidebar">
      <span></span>
      <span></span>
      <span></span>
    </div>
    
    <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="sidebar-header">
        <h2>Транснефть</h2>
        <button class="close-sidebar" @click="toggleSidebar">&times;</button>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li>
            <NuxtLink to="/" @click="closeSidebarOnMobile">
              <span class="icon">📊</span>
              <span class="sidebar-text">Главная</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/equipment" @click="closeSidebarOnMobile">
              <span class="icon">🔧</span>
              <span class="sidebar-text">Оборудование</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/employees" @click="closeSidebarOnMobile">
              <span class="icon">👥</span>
              <span class="sidebar-text">Сотрудники</span>
            </NuxtLink>
          </li>
          <li>
            <a href="#" @click.prevent="logout">
              <span class="icon">🚪</span>
              <span class="sidebar-text">Выход</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
    
    <main class="main-content">
      <header class="header">
        <h1>{{ pageTitle }}</h1>
        <div class="user-info">
          <span v-if="authStore.currentUser">{{ authStore.currentUser.name }}</span>
        </div>
      </header>
      
      <div class="content">
        <slot />
      </div>
    </main>
    
    <div class="sidebar-overlay" v-if="sidebarOpen" @click="toggleSidebar"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Responsive sidebar state
const sidebarOpen = ref(false);

// Map route paths to page titles
const pageTitles = {
  '/': 'Панель управления',
  '/equipment': 'Учет оборудования',
  '/employees': 'Сотрудники'
};

// Compute the page title based on the current route
const pageTitle = computed(() => {
  return pageTitles[route.path] || 'Транснефть';
});

// Toggle sidebar function for mobile
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
  
  // Prevent scrolling when sidebar is open
  if (process.client) {
    document.body.style.overflow = sidebarOpen.value ? 'hidden' : '';
  }
};

// Close sidebar on mobile after navigation
const closeSidebarOnMobile = () => {
  if (process.client && window.innerWidth < 768) {
    sidebarOpen.value = false;
    document.body.style.overflow = '';
  }
};

// Logout function
const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
  position: relative;
}

.sidebar {
  width: 250px;
  background-color: white;
  color: #333;
  padding: $spacing-lg;
  transition: all $transition-normal;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-xl;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  
  h2 {
    color: $primary-color;
    margin-bottom: 0;
    font-size: 1.5rem;
  }
  
  .close-sidebar {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: $text-color;
  }
}

.sidebar-nav {
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      margin-bottom: $spacing-md;
      
      a {
        display: flex;
        align-items: center;
        color: $text-color;
        text-decoration: none;
        padding: $spacing-sm $spacing-md;
        border-radius: 30px;
        transition: all $transition-fast;
        
        &:hover, &.router-link-active {
          background-color: rgba($primary-color, 0.1);
          color: $primary-color;
        }
        
        .icon {
          margin-right: $spacing-md;
          font-size: 1.2rem;
        }
      }
    }
  }
}

.main-content {
  flex: 1;
  margin-left: 250px;
  padding: $spacing-lg;
  transition: margin-left $transition-normal;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
  margin-bottom: $spacing-lg;
  background-color: white;
  border-radius: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  h1 {
    margin: 0;
    font-size: 1.5rem;
    color: $primary-color;
  }
}

.user-info {
  display: flex;
  align-items: center;
  background-color: rgba($primary-color, 0.1);
  padding: $spacing-sm $spacing-md;
  border-radius: 30px;
  
  span {
    font-weight: $font-weight-bold;
    color: $primary-color;
  }
}

.content {
  padding: $spacing-md 0;
}

.sidebar-toggle {
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  
  span {
    display: block;
    width: 20px;
    height: 2px;
    background-color: $primary-color;
    margin: 2px 0;
    transition: all 0.3s ease;
  }
}

.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Responsive styles */
@media (max-width: 991px) {
  .sidebar {
    width: 200px;
  }
  
  .main-content {
    margin-left: 200px;
  }
}

@media (max-width: 767px) {
  .sidebar {
    transform: translateX(-100%);
    width: 250px;
  }
  
  .sidebar-open {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
    padding: $spacing-md;
  }
  
  .sidebar-toggle {
    display: flex;
  }
  
  .sidebar-overlay {
    display: block;
  }
  
  .sidebar-header .close-sidebar {
    display: block;
  }
  
  .header {
    padding: $spacing-sm;
    margin-top: 60px;
    
    h1 {
      font-size: 1.2rem;
    }
  }
  
  .user-info {
    padding: $spacing-xs $spacing-sm;
    
    span {
      font-size: 0.9rem;
    }
  }
}

@media (max-width: 480px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-sm;
  }
}
</style>
