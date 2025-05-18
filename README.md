# Описание компонента `app.vue`

Компонент `app.vue` является корневым компонентом Nuxt-приложения. Он определяет точку входа и инициализацию глобальных процессов, например, проверку авторизации пользователя при запуске приложения.

## Кратко о назначении
- Запускает инициализацию хранилища авторизации (`authStore`).
- Оборачивает всё приложение в NuxtLayout, обеспечивая поддержку layout-структуры.
- Через `<NuxtPage />` отображает текущую страницу в зависимости от маршрута.

## Объяснение кода в `app.vue`

### Шаблон (`<template>`)
- `<NuxtLayout>` — оборачивает приложение в выбранный layout (например, default или auth).
- `<NuxtPage />` — компонент, который рендерит текущую страницу согласно маршруту.

### Логика (`<script setup>`)
- Импортируется хранилище авторизации Pinia (`useAuthStore`).
- При монтировании приложения вызывается `authStore.initAuth()` для проверки и восстановления статуса авторизации пользователя.

### Полный код компонента `app.vue`

```vue
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';

// Initialize auth store
const authStore = useAuthStore();

// Check for stored authentication on app load
onMounted(() => {
  authStore.initAuth();
});
</script>
```

---


# Описание компонента `layouts/default.vue`

Компонент `layouts/default.vue` отвечает за основной макет (layout) приложения. Он реализует адаптивный интерфейс с боковой навигацией (sidebar), заголовком страницы и областью для контента. Макет обеспечивает навигацию между основными разделами: Главная, Оборудование, Сотрудники, а также реализует функции управления видимостью боковой панели и выходом пользователя из системы.

## Кратко о назначении

- Формирует общий каркас страницы: боковая панель, шапка, основное содержимое.
- Управляет навигацией между разделами приложения.
- Обеспечивает адаптивность (sidebar скрывается на мобильных устройствах).
- Показывает имя текущего пользователя и позволяет выйти из системы.

## Объяснение кода в `layouts/default.vue`

### Шаблон (`<template>`)
- `<div class="app-layout">` — корневой контейнер макета.
- `<div class="sidebar-toggle" @click="toggleSidebar">` — кнопка для открытия/закрытия боковой панели на мобильных устройствах.
- `<aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">` — боковая панель с навигацией по разделам:
  - Ссылка "Главная" (`/`)
  - Ссылка "Оборудование" (`/equipment`)
  - Ссылка "Сотрудники" (`/employees`)
  - Кнопка "Выход" (вызывает функцию `logout`)
- `<main class="main-content">` — основная область страницы:
  - `<header class="header">` — заголовок с названием текущей страницы и информацией о пользователе.
  - `<div class="content">` — слот для отображения содержимого текущей страницы.
- `<div class="sidebar-overlay" v-if="sidebarOpen" @click="toggleSidebar"></div>` — затемнение фона при открытой боковой панели на мобильных устройствах.

### Логика (`<script setup>`)
- Импортируются необходимые функции из Vue и Pinia.
- `sidebarOpen` — реактивное состояние для управления видимостью боковой панели.
- `pageTitles` — объект для отображения заголовка страницы в зависимости от маршрута.
- `pageTitle` — вычисляемое свойство для динамического заголовка.
- `toggleSidebar` — функция для открытия/закрытия боковой панели и блокировки прокрутки фона.
- `closeSidebarOnMobile` — функция для автоматического закрытия боковой панели после перехода по ссылке на мобильных устройствах.
- `logout` — функция выхода пользователя и перенаправления на страницу логина.

### Стили (`<style lang="scss" scoped>`)
- Оформление макета, боковой панели, заголовка, контента и кнопки открытия sidebar.
- Реализована адаптивность с помощью медиазапросов для разных размеров экрана.
- Используются SCSS переменные для отступов, цветов и анимаций.

---

### Полный код компонента `layouts/default.vue`

```vue
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
    width: 100%;
    height: 100%;
    padding-top: 60px;
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
```

---

# Описание компонента `CanvasBarChart.vue`

Компонент `CanvasBarChart.vue` реализует отрисовку столбчатой диаграммы на чистом Canvas без сторонних библиотек. Поддерживает адаптивность, кастомные цвета, анимацию и автоматическую подстройку размеров.

## Кратко о назначении
- Отображает столбчатую диаграмму по переданным данным.
- Реализует анимацию и адаптивное изменение размеров.
- Позволяет настраивать цвета столбцов, размеры, заголовок.

## Объяснение кода в `CanvasBarChart.vue`

### Шаблон (`<template>`)
- `<div class="canvas-chart" ref="chartContainerRef">` — контейнер для canvas, необходим для адаптивности.
- `<canvas ref="canvasRef" :width="width" :height="height"></canvas>` — сам canvas для отрисовки графика.

### Логика (`<script setup>`)
- Импортируются хуки Vue и кастомный composable `useCanvasChart`.
- Пропсы: `data`, `width`, `height`, `title`, `barColors`, `animate`.
- Используются refs для canvas и контейнера.
- Функция `drawChart` отвечает за отрисовку графика и подгонку размеров под DPI экрана.
- Реализована поддержка ResizeObserver и window resize для адаптивности.
- При изменении данных или размеров график перерисовывается.

### Стили (`<style lang="scss" scoped>`)
- Оформление контейнера и canvas для корректного отображения и адаптивности.

### Полный код компонента `CanvasBarChart.vue`

```vue
<template>
  <div class="canvas-chart" ref="chartContainerRef">
    <canvas ref="canvasRef" :width="width" :height="height"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useCanvasChart } from '~/composables/useCanvasChart';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({ labels: [], values: [] })
  },
  width: {
    type: Number,
    default: 600
  },
  height: {
    type: Number,
    default: 400
  },
  title: {
    type: String,
    default: ''
  },
  barColors: {
    type: Array,
    default: () => ['#0056a4', '#e74c3c', '#27ae60', '#f39c12']
  },
  animate: {
    type: Boolean,
    default: true
  }
});

const canvasRef = ref(null);
const chartContainerRef = ref(null);
const { drawBarChart } = useCanvasChart();

// Set up responsive behavior
const dpr = ref(window.devicePixelRatio || 1);
const isResizing = ref(false);

// Function to draw the chart - define it before using it
const drawChart = () => {
  if (canvasRef.value) {
    // Get actual container dimensions
    const container = chartContainerRef.value;
    const containerWidth = container ? container.clientWidth : props.width;
    const containerHeight = container ? container.clientHeight : props.height;
    
    // Set canvas dimensions with device pixel ratio for sharper rendering
    canvasRef.value.width = containerWidth * dpr.value;
    canvasRef.value.height = containerHeight * dpr.value;
    
    // Set display size (CSS)
    canvasRef.value.style.width = `${containerWidth}px`;
    canvasRef.value.style.height = `${containerHeight}px`;
    
    // Scale the context to ensure correct drawing
    const ctx = canvasRef.value.getContext('2d');
    ctx.scale(dpr.value, dpr.value);
    
    // Adjust font size based on container width
    let fontSize = 16;
    let valueFontSize = 12;
    let labelFontSize = 12;
    
    if (containerWidth < 400) {
      fontSize = 14;
      valueFontSize = 10;
      labelFontSize = 9;
    } else if (containerWidth < 600) {
      fontSize = 15;
      valueFontSize = 11;
      labelFontSize = 10;
    }
    
    // Draw chart with adjusted dimensions and font sizes
    drawBarChart(canvasRef.value, props.data, {
      width: containerWidth,
      height: containerHeight,
      title: props.title,
      barColors: props.barColors,
      animate: !isResizing.value && props.animate,
      fontSize,
      valueFontSize,
      labelFontSize
    });
  }
};

// Handle resize events with debounce
let resizeTimeout;
const handleResize = () => {
  if (resizeTimeout) clearTimeout(resizeTimeout);
  
  isResizing.value = true;
  
  resizeTimeout = setTimeout(() => {
    isResizing.value = false;
    drawChart();
  }, 250);
  
  // Immediate redraw during resize but without animation
  drawChart();
};

// Set up resize observer
let resizeObserver;

// Draw chart when component is mounted
onMounted(() => {
  drawChart();
  
  // Create resize observer to update dimensions when container size changes
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(handleResize);
    if (chartContainerRef.value) {
      resizeObserver.observe(chartContainerRef.value);
    }
  }
  
  // Fallback to window resize event if ResizeObserver is not available
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // Clean up observers and event listeners
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  window.removeEventListener('resize', handleResize);
  if (resizeTimeout) clearTimeout(resizeTimeout);
});

// Redraw chart when data or props change
watch([() => props.data, () => props.width, () => props.height], drawChart, { deep: true });
</script>

<style lang="scss" scoped>
.canvas-chart {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
```

---

# Описание компонента `CanvasLineChart.vue`

Компонент `CanvasLineChart.vue` реализует отрисовку линейной диаграммы на Canvas. Поддерживает анимацию, адаптивность, кастомные цвета линий и точек, а также отображение сетки.

## Кратко о назначении
- Отображает линейный график по переданным данным.
- Поддерживает анимацию, сетку, адаптивные размеры, настройку цветов.

## Объяснение кода в `CanvasLineChart.vue`

### Шаблон (`<template>`)
- `<div class="canvas-chart" ref="chartContainerRef">` — контейнер для canvas.
- `<canvas ref="canvasRef" :width="width" :height="height"></canvas>` — сам canvas для отрисовки графика.

### Логика (`<script setup>`)
- Импортируются хуки Vue и composable `useCanvasChart`.
- Пропсы: `data`, `width`, `height`, `title`, `lineColor`, `pointColor`, `animate`, `gridLines`.
- Функция `drawChart` настраивает размеры, DPI, стили, вызывает отрисовку через `drawLineChart`.
- ResizeObserver и window resize обеспечивают адаптивность.
- Перерисовка при изменении данных или размеров.

### Стили (`<style lang="scss" scoped>`)
- Оформление контейнера и canvas для корректной адаптивности.

### Полный код компонента `CanvasLineChart.vue`

```vue
<template>
  <div class="canvas-chart" ref="chartContainerRef">
    <canvas ref="canvasRef" :width="width" :height="height"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useCanvasChart } from '~/composables/useCanvasChart';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({ labels: [], values: [] })
  },
  width: {
    type: Number,
    default: 600
  },
  height: {
    type: Number,
    default: 400
  },
  title: {
    type: String,
    default: ''
  },
  lineColor: {
    type: String,
    default: '#0056a4'
  },
  pointColor: {
    type: String,
    default: '#e74c3c'
  },
  animate: {
    type: Boolean,
    default: true
  },
  gridLines: {
    type: Boolean,
    default: true
  }
});

const canvasRef = ref(null);
const chartContainerRef = ref(null);
const { drawLineChart } = useCanvasChart();

// Set up responsive behavior
const dpr = ref(window.devicePixelRatio || 1);
const isResizing = ref(false);

// Function to draw the chart - define it before using it
const drawChart = () => {
  if (canvasRef.value) {
    // Get actual container dimensions
    const container = chartContainerRef.value;
    const containerWidth = container ? container.clientWidth : props.width;
    const containerHeight = container ? container.clientHeight : props.height;
    
    // Set canvas dimensions with device pixel ratio for sharper rendering
    canvasRef.value.width = containerWidth * dpr.value;
    canvasRef.value.height = containerHeight * dpr.value;
    
    // Set display size (CSS)
    canvasRef.value.style.width = `${containerWidth}px`;
    canvasRef.value.style.height = `${containerHeight}px`;
    
    // Scale the context to ensure correct drawing
    const ctx = canvasRef.value.getContext('2d');
    ctx.scale(dpr.value, dpr.value);
    
    // Adjust font size and point radius based on container width
    let fontSize = 16;
    let labelFontSize = 10;
    let valueFontSize = 12;
    let pointRadius = 5;
    let lineWidth = 2;
    
    if (containerWidth < 400) {
      fontSize = 14;
      labelFontSize = 8;
      valueFontSize = 9;
      pointRadius = 3;
      lineWidth = 1.5;
    } else if (containerWidth < 600) {
      fontSize = 15;
      labelFontSize = 9;
      valueFontSize = 10;
      pointRadius = 4;
      lineWidth = 1.75;
    }
    
    // Draw chart with adjusted dimensions and font sizes
    drawLineChart(canvasRef.value, props.data, {
      width: containerWidth,
      height: containerHeight,
      title: props.title,
      lineColor: props.lineColor,
      pointColor: props.pointColor,
      animate: !isResizing.value && props.animate,
      gridLines: props.gridLines,
      fontSize,
      labelFontSize,
      valueFontSize,
      pointRadius,
      lineWidth
    });
  }
};

// Handle resize events with debounce
let resizeTimeout;
const handleResize = () => {
  if (resizeTimeout) clearTimeout(resizeTimeout);
  
  isResizing.value = true;
  
  resizeTimeout = setTimeout(() => {
    isResizing.value = false;
    drawChart();
  }, 250);
  
  // Immediate redraw during resize but without animation
  drawChart();
};

// Set up resize observer
let resizeObserver;

// Draw chart when component is mounted
onMounted(() => {
  drawChart();
  
  // Create resize observer to update dimensions when container size changes
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(handleResize);
    if (chartContainerRef.value) {
      resizeObserver.observe(chartContainerRef.value);
    }
  }
  
  // Fallback to window resize event if ResizeObserver is not available
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // Clean up observers and event listeners
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  window.removeEventListener('resize', handleResize);
  if (resizeTimeout) clearTimeout(resizeTimeout);
});

// Redraw chart when data or props change
watch([() => props.data, () => props.width, () => props.height, () => props.gridLines], drawChart, { deep: true });
</script>

<style lang="scss" scoped>
.canvas-chart {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
```

---

# Описание компонента `CanvasPieChart.vue`

Компонент `CanvasPieChart.vue` реализует отрисовку круговой (pie) или кольцевой (donut) диаграммы на Canvas. Поддерживает анимацию, кастомные цвета, режим donut, адаптивность.

## Кратко о назначении
- Отображает круговую или кольцевую диаграмму по переданным данным.
- Позволяет настраивать цвета, отображать donut-режим, анимировать построение.
- Адаптируется под размер контейнера.

## Объяснение кода в `CanvasPieChart.vue`

### Шаблон (`<template>`)
- `<div class="canvas-chart" ref="chartContainerRef">` — контейнер для canvas.
- `<canvas ref="canvasRef" :width="width" :height="height"></canvas>` — canvas для отрисовки.

### Логика (`<script setup>`)
- Импортируются хуки Vue и composable `useCanvasChart`.
- Пропсы: `data`, `width`, `height`, `title`, `colors`, `animate`, `donut`, `donutWidth`.
- Функция `drawChart` настраивает размеры, DPI, стили, вызывает отрисовку через `drawPieChart`.
- ResizeObserver и window resize обеспечивают адаптивность.
- Перерисовка при изменении данных или размеров.

### Стили (`<style lang="scss" scoped>`)
- Оформление контейнера и canvas для корректной адаптивности.

### Полный код компонента `CanvasPieChart.vue`

```vue
<template>
  <div class="canvas-chart" ref="chartContainerRef">
    <canvas ref="canvasRef" :width="width" :height="height"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useCanvasChart } from '~/composables/useCanvasChart';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({ labels: [], values: [] })
  },
  width: {
    type: Number,
    default: 600
  },
  height: {
    type: Number,
    default: 400
  },
  title: {
    type: String,
    default: ''
  },
  colors: {
    type: Array,
    default: () => ['#0056a4', '#e74c3c', '#27ae60', '#f39c12', '#9b59b6']
  },
  animate: {
    type: Boolean,
    default: true
  },
  donut: {
    type: Boolean,
    default: false
  },
  donutWidth: {
    type: Number,
    default: 50
  }
});

const canvasRef = ref(null);
const chartContainerRef = ref(null);
const { drawPieChart } = useCanvasChart();

// Set up responsive behavior
const dpr = ref(window.devicePixelRatio || 1);
const isResizing = ref(false);

// Function to draw the chart - define it before using it
const drawChart = () => {
  if (canvasRef.value) {
    // Get actual container dimensions
    const container = chartContainerRef.value;
    const containerWidth = container ? container.clientWidth : props.width;
    const containerHeight = container ? container.clientHeight : props.height;
    
    // Set canvas dimensions with device pixel ratio for sharper rendering
    canvasRef.value.width = containerWidth * dpr.value;
    canvasRef.value.height = containerHeight * dpr.value;
    
    // Set display size (CSS)
    canvasRef.value.style.width = `${containerWidth}px`;
    canvasRef.value.style.height = `${containerHeight}px`;
    
    // Scale the context to ensure correct drawing
    const ctx = canvasRef.value.getContext('2d');
    ctx.scale(dpr.value, dpr.value);
    
    // Adjust font size and donut width based on container size
    let fontSize = 16;
    let labelFontSize = 12;
    let adaptiveDonutWidth = props.donutWidth;
    
    if (containerWidth < 400) {
      fontSize = 14;
      labelFontSize = 10;
      adaptiveDonutWidth = Math.max(30, props.donutWidth * 0.7);
    } else if (containerWidth < 600) {
      fontSize = 15;
      labelFontSize = 11;
      adaptiveDonutWidth = Math.max(35, props.donutWidth * 0.85);
    }
    
    // Draw chart with adjusted dimensions and font sizes
    drawPieChart(canvasRef.value, props.data, {
      width: containerWidth,
      height: containerHeight,
      title: props.title,
      colors: props.colors,
      animate: !isResizing.value && props.animate,
      donut: props.donut,
      donutWidth: adaptiveDonutWidth,
      fontSize,
      labelFontSize
    });
  }
};

// Handle resize events with debounce
let resizeTimeout;
const handleResize = () => {
  if (resizeTimeout) clearTimeout(resizeTimeout);
  
  isResizing.value = true;
  
  resizeTimeout = setTimeout(() => {
    isResizing.value = false;
    drawChart();
  }, 250);
  
  // Immediate redraw during resize but without animation
  drawChart();
};

// Set up resize observer
let resizeObserver;

// Draw chart when component is mounted
onMounted(() => {
  drawChart();
  
  // Create resize observer to update dimensions when container size changes
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(handleResize);
    if (chartContainerRef.value) {
      resizeObserver.observe(chartContainerRef.value);
    }
  }
  
  // Fallback to window resize event if ResizeObserver is not available
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // Clean up observers and event listeners
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  window.removeEventListener('resize', handleResize);
  if (resizeTimeout) clearTimeout(resizeTimeout);
});

// Redraw chart when data or props change
watch([() => props.data, () => props.width, () => props.height, () => props.donut, () => props.donutWidth], drawChart, { deep: true });
</script>

<style lang="scss" scoped>
.canvas-chart {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
```

---

# Описание компонента `DashboardCharts.vue`

Компонент `DashboardCharts.vue` предназначен для отображения различных типов графиков (столбчатых, линейных, круговых) внутри карточки dashboard-а. Позволяет гибко выбирать тип графика, передавать данные и управлять размерами.

## Кратко о назначении
- Универсальный компонент-обёртка для визуализации данных на dashboard.
- Поддерживает типы графиков: bar, line, pie, donut.
- Адаптирует размеры графика под контейнер и экран.

## Объяснение кода в `DashboardCharts.vue`

### Шаблон (`<template>`)
- `<div class="dashboard-charts">` — основной контейнер компонента.
- `<div class="card">` — карточка с заголовком и графиком.
- `<component :is="chartComponent" ... />` — динамически выбирает компонент графика (bar, line, pie, donut) по prop-у `chartType`.

### Логика (`<script setup>`)
- Импортируются необходимые компоненты графиков и хуки Vue.
- Пропсы: `title`, `chartType`, `chartData`, `width`, `height`, `chartTitle`, `chartProps`.
- Выбор компонента графика происходит через вычисляемое свойство `chartComponent`.
- Используются refs и ResizeObserver для адаптивных размеров.
- При изменении размеров контейнера или экрана пересчитываются размеры графика.

### Стили (`<style lang="scss" scoped>`)
- Оформление карточки, контейнера графика и адаптивные стили для разных экранов.

### Полный код компонента `DashboardCharts.vue`

```vue
<template>
  <div class="dashboard-charts">
    <div class="card">
      <h3>{{ title }}</h3>
      <div class="chart-container" ref="chartContainerRef">
        <component 
          :is="chartComponent" 
          :data="chartData" 
          :width="containerWidth" 
          :height="containerHeight"
          :title="chartTitle"
          v-bind="chartProps"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import CanvasBarChart from '~/components/CanvasBarChart.vue';
import CanvasPieChart from '~/components/CanvasPieChart.vue';
import CanvasLineChart from '~/components/CanvasLineChart.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  chartType: {
    type: String,
    default: 'bar',
    validator: (value) => ['bar', 'pie', 'line', 'donut'].includes(value)
  },
  chartData: {
    type: Object,
    required: true
  },
  width: {
    type: Number,
    default: 600
  },
  height: {
    type: Number,
    default: 400
  },
  chartTitle: {
    type: String,
    default: ''
  },
  chartProps: {
    type: Object,
    default: () => ({})
  }
});

// Determine which chart component to use based on chartType
const chartComponent = computed(() => {
  switch (props.chartType) {
    case 'bar':
      return CanvasBarChart;
    case 'pie':
      return CanvasPieChart;
    case 'donut':
      return CanvasPieChart; // Use PieChart with donut prop
    case 'line':
      return CanvasLineChart;
    default:
      return CanvasBarChart;
  }
});

// Responsive chart dimensions
const chartContainerRef = ref(null);
const containerWidth = ref(props.width);
const containerHeight = ref(props.height);

// Function to update chart dimensions based on container size
const updateChartDimensions = () => {
  if (chartContainerRef.value) {
    const containerRect = chartContainerRef.value.getBoundingClientRect();
    containerWidth.value = containerRect.width;
    
    // Adjust height based on screen size
    if (window.innerWidth <= 480) {
      containerHeight.value = 250;
    } else if (window.innerWidth <= 768) {
      containerHeight.value = 300;
    } else {
      containerHeight.value = props.height;
    }
  }
};

// Set up resize observer for responsive behavior
let resizeObserver;

onMounted(() => {
  updateChartDimensions();
  
  // Create resize observer to update dimensions when container size changes
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(updateChartDimensions);
    if (chartContainerRef.value) {
      resizeObserver.observe(chartContainerRef.value);
    }
  }
  
  // Fallback to window resize event if ResizeObserver is not available
  window.addEventListener('resize', updateChartDimensions);
});

onUnmounted(() => {
  // Clean up observers and event listeners
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  window.removeEventListener('resize', updateChartDimensions);
});
</script>

<style lang="scss" scoped>
.dashboard-charts {
  margin-bottom: $spacing-lg;
  width: 100%;
  
  @media (max-width: 767px) {
    margin-bottom: $spacing-md;
  }
}

.chart-container {
  width: 100%;
  height: 400px;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 767px) {
    height: 300px;
  }
  
  @media (max-width: 480px) {
    height: 250px;
  }
}

.card {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  h3 {
    margin-top: 0;
    margin-bottom: $spacing-md;
    
    @media (max-width: 480px) {
      font-size: 1rem;
      margin-bottom: $spacing-sm;
    }
  }
}
</style>
```

---

# Описание компонента `layouts/auth.vue`

Компонент `layouts/auth.vue` реализует минималистичный макет для страниц авторизации (например, логин, регистрация, восстановление пароля). Он используется для отображения страниц, не требующих основной навигации приложения, и обеспечивает центрирование содержимого по экрану.

## Кратко о назначении
- Определяет простой и лаконичный layout для auth-страниц.
- Центрирует содержимое по вертикали и горизонтали.
- Использует слот для вставки любого содержимого (например, формы входа).
- Не содержит боковых панелей, хедера или футера.

## Объяснение кода в `layouts/auth.vue`

### Шаблон (`<template>`)
- `<div class="auth-layout">` — основной контейнер layout-а для auth-страниц, который центрирует контент.
- `<slot />` — место для отображения содержимого страницы (например, формы авторизации, регистрации и т.д.).

### Логика (`<script setup>`)
- В данном компоненте отсутствует логика, так как layout только определяет структуру и стили.

### Стили (`<style lang="scss" scoped>`)
- `.auth-layout` — растягивает контейнер на всю высоту и ширину экрана, центрирует контент с помощью flexbox, задаёт светлый фон.

### Полный код компонента `layouts/auth.vue`

```vue
<template>
  <div class="auth-layout">
    <slot />
  </div>
</template>

<script setup>
// Логика отсутствует, layout только определяет структуру и стили
</script>

<style lang="scss" scoped>
.auth-layout {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f9fa;
  padding: 0;
  margin: 0;
}
</style>
```

---

# Транснефть - Информационная система

Веб-приложение для Транснефть, разработанное для учета оборудования и сотрудников в различных локациях (Урай).

## Функциональность

- **Авторизация пользователей**: Система требует авторизации для доступа к данным
- **Учет оборудования**: Отслеживание общего количества оборудования, единиц на ревизии и в работе
- **Учет сотрудников**: Информация о сотрудниках, их должностях и местах работы (контора, промбаза, вахта)
- **Визуализация данных**: Графики и диаграммы для наглядного представления информации
- **Двойная реализация графиков**: Через Chart.js и собственную Canvas-реализацию

## Технический стек

- **Nuxt 3**: Современный фреймворк для разработки веб-приложений на Vue.js
- **Pinia**: Управление состоянием приложения
- **Sass**: Стилизация компонентов с использованием препроцессора
- **Chart.js**: Библиотека для создания графиков
- **Canvas API**: Собственная реализация графиков через HTML5 Canvas

## Структура проекта

- `/assets` - Стили и изображения
- `/components` - Компоненты Vue
- `/composables` - Переиспользуемая логика
- `/data` - JSON-файлы с данными
- `/layouts` - Шаблоны страниц
- `/middleware` - Промежуточное ПО (авторизация)
- `/pages` - Страницы приложения
- `/plugins` - Плагины
- `/stores` - Хранилища Pinia
- `/public` - Статические файлы

## Установка и запуск

### Установка зависимостей

```bash
# yarn
yarn install

# npm
npm install
```

### Запуск сервера разработки

```bash
# yarn
yarn dev

# npm
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

### Сборка для продакшена

```bash
# yarn
yarn build

# npm
npm run build
```

## Данные для входа

В системе предустановлены следующие пользователи:

- **Администратор**:
  - Логин: `admin`
  - Пароль: `admin123`

- **Руководитель**:
  - Логин: `manager`
  - Пароль: `manager123`

- **Пользователь**:
  - Логин: `user`
  - Пароль: `user123`
