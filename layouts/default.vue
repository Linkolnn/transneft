<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>Транснефть</h2>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li>
            <NuxtLink to="/">
              <span class="icon">📊</span>
              <span class="sidebar-text">Главная</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/equipment">
              <span class="icon">🔧</span>
              <span class="sidebar-text">Оборудование</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/employees">
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
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

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

// Logout function
const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style lang="scss" scoped>
.sidebar-header {
  margin-bottom: $spacing-xl;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h2 {
    color: $light-color;
    margin-bottom: 0;
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
        color: $light-color;
        text-decoration: none;
        padding: $spacing-sm;
        border-radius: $border-radius-sm;
        transition: background-color $transition-fast;
        
        &:hover, &.router-link-active {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .icon {
          margin-right: $spacing-md;
          font-size: 1.2rem;
        }
      }
    }
  }
}

.user-info {
  display: flex;
  align-items: center;
  
  span {
    font-weight: $font-weight-bold;
  }
}

.content {
  padding: $spacing-md 0;
}
</style>
