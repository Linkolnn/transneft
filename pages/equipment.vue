<template>
  <div class="equipment-page">
    <div class="card">
      <h3>Общая статистика оборудования</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ equipmentStore.totalEquipment }}</div>
          <div class="stat-label">Всего единиц</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ equipmentStore.equipmentUnderRevision }}</div>
          <div class="stat-label">На ревизии</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ equipmentStore.operationalEquipment }}</div>
          <div class="stat-label">В рабочем состоянии</div>
        </div>
      </div>
    </div>
    
    <div class="charts-container">
      <!-- Chart.js chart -->
      <div class="card chart-card">
        <h3>Состояние оборудования</h3>
        <div class="chart-container">
          <canvas ref="equipmentChartRef"></canvas>
        </div>
      </div>
      
      <!-- Custom Canvas chart -->
      <DashboardCharts 
        title="Состояние оборудования" 
        chartType="bar"
        :chartData="canvasEquipmentData"
        :width="600"
        :height="400"
        chartTitle="Оборудование по категориям"
      />
    </div>
    
    <div class="charts-container">
      <!-- Chart.js chart -->
      <div class="card chart-card">
        <h3>История ревизий по месяцам</h3>
        <div class="chart-container">
          <canvas ref="revisionChartRef"></canvas>
        </div>
      </div>
      
      <!-- Custom Canvas chart -->
      <DashboardCharts 
        title="История ревизий" 
        chartType="line"
        :chartData="canvasRevisionData"
        :width="600"
        :height="400"
        chartTitle="Завершенные ревизии по месяцам"
      />
    </div>
    
    <div class="card">
      <div class="table-header">
        <h3>Список оборудования</h3>
        <button @click="showAddForm = !showAddForm" class="btn-add">
          {{ showAddForm ? 'Скрыть форму' : 'Добавить оборудование' }}
        </button>
      </div>
      
      <div v-if="showAddForm" class="add-equipment-form">
        <h4>Добавление нового оборудования</h4>
        <div class="form-grid">
          <div class="form-group">
            <label for="equipment-name">Наименование</label>
            <input 
              id="equipment-name" 
              v-model="newEquipment.name" 
              type="text" 
              class="form-input"
              placeholder="Введите название"
            />
          </div>
          
          <div class="form-group">
            <label for="equipment-total">Всего единиц</label>
            <input 
              id="equipment-total" 
              v-model.number="newEquipment.total" 
              type="number" 
              min="0"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="equipment-revision">На ревизии</label>
            <input 
              id="equipment-revision" 
              v-model.number="newEquipment.underRevision" 
              type="number" 
              min="0"
              :max="newEquipment.total"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="equipment-date">Дата последней ревизии</label>
            <input 
              id="equipment-date" 
              v-model="newEquipment.lastRevisionDate" 
              type="date" 
              class="form-input"
            />
          </div>
        </div>
        
        <div class="form-actions">
          <button @click="addEquipment" class="btn-save" :disabled="!isFormValid">Добавить</button>
          <button @click="resetForm" class="btn-cancel">Очистить</button>
        </div>
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>Наименование</th>
            <th>Всего</th>
            <th>На ревизии</th>
            <th>В работе</th>
            <th>Последняя ревизия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in equipmentStore.allEquipment" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.total }}</td>
            <td>{{ item.underRevision }}</td>
            <td>{{ item.operational }}</td>
            <td>{{ formatDate(item.lastRevisionDate) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useEquipmentStore } from '~/stores/equipment';
import Chart from 'chart.js/auto';
import DashboardCharts from '~/components/DashboardCharts.vue';

// Define middleware
definePageMeta({
  middleware: ['auth']
});

const equipmentStore = useEquipmentStore();
const { $convertToCanvasChartData } = useNuxtApp();

// Chart references
const equipmentChartRef = ref(null);
const revisionChartRef = ref(null);

// Chart instances
let equipmentChart = null;
let revisionChart = null;

// New equipment form
const showAddForm = ref(false);
const newEquipment = ref({
  name: '',
  total: 0,
  underRevision: 0,
  lastRevisionDate: new Date().toISOString().split('T')[0]
});

// Computed property for form validation
const isFormValid = computed(() => {
  return (
    newEquipment.value.name.trim() !== '' &&
    newEquipment.value.total > 0 &&
    newEquipment.value.underRevision >= 0 &&
    newEquipment.value.underRevision <= newEquipment.value.total &&
    newEquipment.value.lastRevisionDate
  );
});

// Computed property for operational equipment
const operational = computed(() => {
  return newEquipment.value.total - newEquipment.value.underRevision;
});

// Add new equipment
const addEquipment = () => {
  if (isFormValid.value) {
    const equipmentToAdd = {
      ...newEquipment.value,
      operational: operational.value
    };
    
    equipmentStore.addEquipment(equipmentToAdd);
    resetForm();
    showAddForm.value = false;
  }
};

// Reset form
const resetForm = () => {
  newEquipment.value = {
    name: '',
    total: 0,
    underRevision: 0,
    lastRevisionDate: new Date().toISOString().split('T')[0]
  };
};

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

// Convert Chart.js data to Canvas chart format
const canvasEquipmentData = computed(() => {
  return $convertToCanvasChartData(equipmentStore.equipmentChartData);
});

const canvasRevisionData = computed(() => {
  return $convertToCanvasChartData(equipmentStore.revisionChartData);
});

// Fetch data and initialize charts
onMounted(async () => {
  await equipmentStore.fetchEquipment();
  initCharts();
});

const initCharts = () => {
  // Equipment status chart
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
            text: 'Состояние оборудования по категориям'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  // Revision history chart
  if (revisionChartRef.value) {
    revisionChart = new Chart(revisionChartRef.value, {
      type: 'line',
      data: equipmentStore.revisionChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Завершенные ревизии по месяцам'
          }
        },
        scales: {
          y: {
            beginAtZero: true
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
  
  if (revisionChart) {
    revisionChart.destroy();
  }
});
</script>

<style lang="scss" scoped>
.equipment-page {
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

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
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

.card {
  background-color: white;
  border-radius: $border-radius-lg;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: $spacing-lg;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
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

.add-equipment-form {
  background-color: #f8f9fa;
  padding: $spacing-md;
  border-radius: $border-radius-md;
  margin-bottom: $spacing-lg;
  
  h4 {
    margin-top: 0;
    margin-bottom: $spacing-md;
    color: $primary-color;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-md;
}

.form-group {
  margin-bottom: $spacing-md;
  
  label {
    display: block;
    margin-bottom: $spacing-xs;
    font-weight: 500;
    color: $text-color;
  }
}

.form-input {
  width: 100%;
  padding: 10px 16px;
  border-radius: 20px;
  border: 1px solid #ddd;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 2px rgba($primary-color, 0.1);
  }
}

.form-actions {
  display: flex;
  gap: $spacing-md;
  margin-top: $spacing-md;
}

.btn-add, .btn-save, .btn-cancel {
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add {
  background-color: $primary-color;
  color: white;
  
  &:hover {
    background-color: darken($primary-color, 10%);
  }
}

.btn-save {
  background-color: #27ae60;
  color: white;
  
  &:hover {
    background-color: darken(#27ae60, 10%);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
}

.btn-cancel {
  background-color: #f1f1f1;
  color: $text-color;
  
  &:hover {
    background-color: #e0e0e0;
  }
}
</style>
