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
