<template>
  <div class="dashboard">
    <div class="dashboard-summary">
      <div class="card summary-card">
        <h3>Оборудование</h3>
        <div class="summary-content">
          <div class="summary-item">
            <span class="summary-label">Всего:</span>
            <span class="summary-value">{{ equipmentStore.totalEquipment }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">На ревизии:</span>
            <span class="summary-value">{{ equipmentStore.equipmentUnderRevision }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">В работе:</span>
            <span class="summary-value">{{ equipmentStore.operationalEquipment }}</span>
          </div>
        </div>
        <NuxtLink to="/equipment" class="btn btn-sm">Подробнее</NuxtLink>
      </div>
      
      <div class="card summary-card">
        <h3>Сотрудники</h3>
        <div class="summary-content">
          <div class="summary-item">
            <span class="summary-label">Всего:</span>
            <span class="summary-value">{{ employeesStore.employeeCount }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">В конторе:</span>
            <span class="summary-value">{{ employeesStore.employeesByLocation('Контора').length }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">На промбазе:</span>
            <span class="summary-value">{{ employeesStore.employeesByLocation('Промбаза').length }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">На вахте:</span>
            <span class="summary-value">{{ employeesStore.employeesByLocation('Вахта').length }}</span>
          </div>
        </div>
        <NuxtLink to="/employees" class="btn btn-sm">Подробнее</NuxtLink>
      </div>
    </div>
    
    <div class="dashboard-charts">
      <!-- Chart.js charts -->
      <div class="card chart-card">
        <h3>Статистика оборудования</h3>
        <div class="chart-container">
          <canvas ref="equipmentChartRef"></canvas>
        </div>
      </div>
      
      <div class="card chart-card">
        <h3>Распределение сотрудников</h3>
        <div class="chart-container">
          <canvas ref="employeeChartRef"></canvas>
        </div>
      </div>
    </div>
    
    <div class="dashboard-charts" v-if="dataLoaded">
      <!-- Custom Canvas charts -->
      <DashboardCharts 
        title="Статистика оборудования" 
        chartType="bar"
        :chartData="canvasEquipmentData"
        :width="600"
        :height="400"
        chartTitle="Оборудование по категориям"
      />
      
      <DashboardCharts 
        title="Распределение сотрудников" 
        chartType="pie"
        :chartData="canvasEmployeeData"
        :width="600"
        :height="400"
        chartTitle="Сотрудники по локациям"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useEquipmentStore } from '~/stores/equipment';
import { useEmployeesStore } from '~/stores/employees';
import Chart from 'chart.js/auto';
import DashboardCharts from '~/components/DashboardCharts.vue';

// Define middleware
definePageMeta({
  middleware: ['auth']
});

const equipmentStore = useEquipmentStore();
const employeesStore = useEmployeesStore();
const { $convertToCanvasChartData } = useNuxtApp();

// Chart references
const equipmentChartRef = ref(null);
const employeeChartRef = ref(null);

// Chart instances
let equipmentChart = null;
let employeeChart = null;

// Track data loading state
const dataLoaded = ref(false);

// Canvas chart data
const canvasEquipmentData = computed(() => {
  return $convertToCanvasChartData(equipmentStore.equipmentChartData);
});

const canvasEmployeeData = computed(() => {
  return $convertToCanvasChartData(employeesStore.locationChartData);
});

// Fetch data
onMounted(async () => {
  // Load data from stores
  await Promise.all([
    equipmentStore.fetchEquipment(),
    employeesStore.fetchEmployees()
  ]);
  
  // Initialize charts after data is loaded
  initCharts();
  dataLoaded.value = true;
});

const initCharts = () => {
  // Equipment chart
  if (equipmentChartRef.value) {
    equipmentChart = new Chart(equipmentChartRef.value, {
      type: 'bar',
      data: equipmentStore.equipmentChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Состояние оборудования'
          }
        }
      }
    });
  }
  
  // Employee chart
  if (employeeChartRef.value) {
    employeeChart = new Chart(employeeChartRef.value, {
      type: 'pie',
      data: employeesStore.locationChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Сотрудники по локациям'
          }
        }
      }
    });
  }
};

// Clean up charts on component unmount
onBeforeUnmount(() => {
  if (equipmentChart) {
    equipmentChart.destroy();
  }
  
  if (employeeChart) {
    employeeChart.destroy();
  }
});
</script>

<style lang="scss" scoped>
.dashboard {
  &-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $spacing-lg;
    margin-bottom: $spacing-xl;
  }
  
  &-charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: $spacing-lg;
  }
}

.summary-card {
  display: flex;
  flex-direction: column;
  
  .summary-content {
    flex: 1;
    margin-bottom: $spacing-md;
  }
  
  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: $spacing-sm;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $border-color;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .summary-label {
    font-weight: $font-weight-bold;
  }
  
  .summary-value {
    font-size: $font-size-large;
    color: $primary-color;
  }
}

.chart-card {
  min-height: 400px;
}

.btn-sm {
  padding: $spacing-xs $spacing-md;
  font-size: $font-size-small;
  align-self: flex-start;
}
</style>
