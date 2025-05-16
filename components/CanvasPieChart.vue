<template>
  <div class="canvas-chart">
    <canvas ref="canvasRef" :width="width" :height="height"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
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
const { drawPieChart } = useCanvasChart();

// Function to draw the chart - define it before using it
const drawChart = () => {
  if (canvasRef.value) {
    drawPieChart(canvasRef.value, props.data, {
      width: props.width,
      height: props.height,
      title: props.title,
      colors: props.colors,
      animate: props.animate,
      donut: props.donut,
      donutWidth: props.donutWidth
    });
  }
};

// Draw chart when component is mounted
onMounted(() => {
  drawChart();
});

// Redraw chart when data changes
watch(() => props.data, drawChart, { deep: true });
</script>

<style lang="scss" scoped>
.canvas-chart {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  canvas {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
