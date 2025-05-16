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
