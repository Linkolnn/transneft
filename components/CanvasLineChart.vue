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
const { drawLineChart } = useCanvasChart();

// Function to draw the chart - define it before using it
const drawChart = () => {
  if (canvasRef.value) {
    drawLineChart(canvasRef.value, props.data, {
      width: props.width,
      height: props.height,
      title: props.title,
      lineColor: props.lineColor,
      pointColor: props.pointColor,
      animate: props.animate,
      gridLines: props.gridLines
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
