<template>
  <div class="employees-page">
    <div class="card">
      <h3>Общая статистика сотрудников</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ employeesStore.employeeCount }}</div>
          <div class="stat-label">Всего сотрудников</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ employeesStore.employeesByLocation('Контора').length }}</div>
          <div class="stat-label">В конторе</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ employeesStore.employeesByLocation('Промбаза').length }}</div>
          <div class="stat-label">На промбазе</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ employeesStore.employeesByLocation('Вахта').length }}</div>
          <div class="stat-label">На вахте</div>
        </div>
      </div>
    </div>
    
    <div class="charts-grid">
      <!-- Chart.js charts -->
      <div class="card chart-card">
        <h3>Распределение по локациям</h3>
        <div class="chart-container">
          <canvas ref="locationChartRef"></canvas>
        </div>
      </div>
      
      <div class="card chart-card">
        <h3>Распределение по должностям</h3>
        <div class="chart-container">
          <canvas ref="positionChartRef"></canvas>
        </div>
      </div>
    </div>
    
    <div class="charts-grid">
      <!-- Custom Canvas charts -->
      <DashboardCharts 
        title="Распределение по локациям" 
        chartType="pie"
        :chartData="canvasLocationData"
        :width="600"
        :height="400"
        chartTitle="Сотрудники по локациям"
      />
      
      <DashboardCharts 
        title="Распределение по должностям" 
        chartType="donut"
        :chartData="canvasPositionData"
        :width="600"
        :height="400"
        chartTitle="Сотрудники по категориям должностей"
        :chartProps="{ donut: true, donutWidth: 50 }"
      />
    </div>
    
    <div class="card">
      <div class="filter-section">
        <h3>Список сотрудников</h3>
        <div class="filters">
          <div class="form-group">
            <label for="location-filter">Локация</label>
            <select id="location-filter" v-model="locationFilter">
              <option value="">Все локации</option>
              <option value="Контора">Контора</option>
              <option value="Промбаза">Промбаза</option>
              <option value="Вахта">Вахта</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="schedule-filter">График работы</label>
            <select id="schedule-filter" v-model="scheduleFilter">
              <option value="">Все графики</option>
              <option value="Постоянный">Постоянный</option>
              <option value="Вахтовый">Вахтовый</option>
            </select>
          </div>
        </div>
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Должность</th>
            <th>Локация</th>
            <th>График работы</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in filteredEmployees" :key="employee.id">
            <td>{{ employee.name }}</td>
            <td>{{ employee.position }}</td>
            <td>
              <div v-if="editingEmployee && editingEmployee.id === employee.id">
                <select v-model="editingEmployee.location" class="edit-select">
                  <option value="Контора">Контора</option>
                  <option value="Промбаза">Промбаза</option>
                  <option value="Вахта">Вахта</option>
                </select>
              </div>
              <div v-else>{{ employee.location }}</div>
            </td>
            <td>
              <div v-if="editingEmployee && editingEmployee.id === employee.id">
                <select v-model="editingEmployee.workSchedule" class="edit-select">
                  <option value="Постоянный">Постоянный</option>
                  <option value="Вахтовый">Вахтовый</option>
                </select>
              </div>
              <div v-else>{{ employee.workSchedule }}</div>
            </td>
            <td>
              <div v-if="editingEmployee && editingEmployee.id === employee.id" class="action-buttons">
                <button @click="saveEmployee" class="btn-save">Сохранить</button>
                <button @click="cancelEdit" class="btn-cancel">Отмена</button>
              </div>
              <div v-else class="action-buttons">
                <button @click="editEmployee(employee)" class="btn-edit">Изменить</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useEmployeesStore } from '~/stores/employees';
import Chart from 'chart.js/auto';
import DashboardCharts from '~/components/DashboardCharts.vue';

// Define middleware
definePageMeta({
  middleware: ['auth']
});

const employeesStore = useEmployeesStore();
const { $convertToCanvasChartData, $convertLocationSummaryToCanvasData, $convertPositionSummaryToCanvasData } = useNuxtApp();

// Chart references
const locationChartRef = ref(null);
const positionChartRef = ref(null);

// Chart instances
let locationChart = null;
let positionChart = null;

// Filters
const locationFilter = ref('');
const scheduleFilter = ref('');

// Employee editing
const editingEmployee = ref(null);

// Computed filtered employees
const filteredEmployees = computed(() => {
  let employees = employeesStore.allEmployees;
  
  if (locationFilter.value) {
    employees = employees.filter(emp => emp.location === locationFilter.value);
  }
  
  if (scheduleFilter.value) {
    employees = employees.filter(emp => emp.workSchedule === scheduleFilter.value);
  }
  
  return employees;
});

// Start editing an employee
const editEmployee = (employee) => {
  editingEmployee.value = { ...employee };
};

// Save edited employee
const saveEmployee = () => {
  if (editingEmployee.value) {
    employeesStore.updateEmployee(editingEmployee.value);
    editingEmployee.value = null;
  }
};

// Cancel editing
const cancelEdit = () => {
  editingEmployee.value = null;
};

// Canvas chart data
const canvasLocationData = computed(() => {
  return $convertToCanvasChartData(employeesStore.locationChartData);
});

const canvasPositionData = computed(() => {
  return $convertToCanvasChartData(employeesStore.positionChartData);
});

// Fetch data and initialize charts
onMounted(async () => {
  await employeesStore.fetchEmployees();
  initCharts();
});

const initCharts = () => {
  // Location distribution chart
  if (locationChartRef.value) {
    locationChart = new Chart(locationChartRef.value, {
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
            text: 'Распределение сотрудников по локациям'
          }
        }
      }
    });
  }
  
  // Position distribution chart
  if (positionChartRef.value) {
    positionChart = new Chart(positionChartRef.value, {
      type: 'doughnut',
      data: employeesStore.positionChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Распределение сотрудников по категориям должностей'
          }
        }
      }
    });
  }
};

// Clean up charts on component unmount
onBeforeUnmount(() => {
  if (locationChart) {
    locationChart.destroy();
  }
  
  if (positionChart) {
    positionChart.destroy();
  }
});
</script>

<style lang="scss" scoped>
.employees-page {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  background-color: #f8f9fa;
  padding: $spacing-lg;
  border-radius: $border-radius-md;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-lg;
  margin-top: $spacing-md;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: $spacing-lg;
}

.stat-item {
  text-align: center;
  padding: $spacing-md;
  border-radius: $border-radius-lg;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  .stat-value {
    font-size: 2rem;
    font-weight: $font-weight-bold;
    color: $primary-color;
    margin-bottom: $spacing-xs;
  }
  
  .stat-label {
    color: $text-color;
    font-size: $font-size-small;
  }
}

.chart-card {
  min-height: 400px;
  background-color: white;
  border-radius: $border-radius-lg;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
  flex-wrap: wrap;
  gap: $spacing-md;
  
  .filters {
    display: flex;
    gap: $spacing-md;
    flex-wrap: wrap;
    
    .form-group {
      margin-bottom: 0;
      min-width: 200px;
    }
  }
}

.card {
  background-color: white;
  border-radius: $border-radius-lg;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: $spacing-lg;
}

.table {
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: $spacing-md;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    font-weight: 600;
    color: $primary-color;
  }
  
  tr:hover {
    background-color: #f8f9fa;
  }
}

.edit-select {
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid #ddd;
  background-color: white;
  width: 100%;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 2px rgba($primary-color, 0.1);
  }
}

.action-buttons {
  display: flex;
  gap: 8px;
  
  button {
    padding: 6px 12px;
    border-radius: 20px;
    border: none;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .btn-edit {
    background-color: #e9f5ff;
    color: $primary-color;
    
    &:hover {
      background-color: #d0e8ff;
    }
  }
  
  .btn-save {
    background-color: #e9fff0;
    color: #27ae60;
    
    &:hover {
      background-color: #d0ffe0;
    }
  }
  
  .btn-cancel {
    background-color: #fff0f0;
    color: #e74c3c;
    
    &:hover {
      background-color: #ffe0e0;
    }
  }
}
</style>
