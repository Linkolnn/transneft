<template>
  <div class="dashboard-charts">
    <div class="card">
      <h3>{{ title }}</h3>
      <div class="chart-container">
        <component 
          :is="chartComponent" 
          :data="chartData" 
          :width="width" 
          :height="height"
          :title="chartTitle"
          v-bind="chartProps"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
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
</script>

<style lang="scss" scoped>
.dashboard-charts {
  margin-bottom: $spacing-lg;
}

.chart-container {
  width: 100%;
  height: 400px;
  position: relative;
}
</style>
