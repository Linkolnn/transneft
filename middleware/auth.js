export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  
  // Initialize auth state from localStorage if available
  authStore.initAuth();
  
  // If the user is not authenticated and is not trying to access the login page
  if (!authStore.isLoggedIn && to.path !== '/login') {
    return navigateTo('/login');
  }
  
  // If the user is authenticated and is trying to access the login page
  if (authStore.isLoggedIn && to.path === '/login') {
    return navigateTo('/');
  }
});
