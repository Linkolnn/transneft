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
      
      <div class="table-responsive">
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
      
      <!-- Mobile equipment cards for smaller screens -->
      <div class="equipment-cards">
        <div v-for="item in equipmentStore.allEquipment" :key="item.id" class="equipment-card">
          <div class="equipment-header">
            <h4>{{ item.name }}</h4>
          </div>
          
          <div class="equipment-details">
            <div class="equipment-detail">
              <span class="detail-label">Всего:</span>
              <span class="detail-value">{{ item.total }}</span>
            </div>
            
            <div class="equipment-detail">
              <span class="detail-label">На ревизии:</span>
              <span class="detail-value">{{ item.underRevision }}</span>
            </div>
            
            <div class="equipment-detail">
              <span class="detail-label">В работе:</span>
              <span class="detail-value">{{ item.operational }}</span>
            </div>
            
            <div class="equipment-detail">
              <span class="detail-label">Последняя ревизия:</span>
              <span class="detail-value">{{ formatDate(item.lastRevisionDate) }}</span>
            </div>
          </div>
        </div>
      </div>
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
  
  @media (max-width: 767px) {
    padding: $spacing-md;
    gap: $spacing-md;
  }
  
  @media (max-width: 480px) {
    padding: $spacing-sm;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-lg;
  margin-top: $spacing-md;
  
  @media (max-width: 767px) {
    gap: $spacing-md;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: $spacing-sm;
  }
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
  
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: $spacing-md;
    margin-bottom: $spacing-md;
  }
}

.stat-item {
  text-align: center;
  padding: $spacing-md;
  border-radius: 20px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: 600;
    color: $primary-color;
    margin-bottom: $spacing-xs;
    
    @media (max-width: 767px) {
      font-size: 1.75rem;
    }
  }
  
  .stat-label {
    color: $text-color;
    font-size: $font-size-small;
  }
  
  @media (max-width: 767px) {
    padding: $spacing-sm;
  }
}

.chart-card {
  min-height: 400px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: $spacing-lg;
  
  h3 {
    color: $primary-color;
    margin-top: 0;
    margin-bottom: $spacing-md;
    font-size: 1.2rem;
  }
  
  @media (max-width: 767px) {
    min-height: 350px;
    padding: $spacing-md;
  }
  
  @media (max-width: 480px) {
    min-height: 300px;
  }
}

.card {
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: $spacing-lg;
  
  h3 {
    color: $primary-color;
    margin-top: 0;
    margin-bottom: $spacing-md;
    font-size: 1.2rem;
  }
  
  @media (max-width: 767px) {
    padding: $spacing-md;
  }
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-sm;
    
    button {
      width: 100%;
    }
  }
}

.table {
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px 16px;
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
  
  @media (max-width: 767px) {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    
    th, td {
      padding: 10px 12px;
      font-size: 14px;
    }
  }
}

/* Mobile equipment cards for smaller screens */
.equipment-cards {
  display: none;
  flex-direction: column;
  gap: $spacing-md;
  
  @media (max-width: 480px) {
    display: flex;
  }
}

.equipment-card {
  background-color: white;
  border-radius: 20px;
  padding: $spacing-md;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  .equipment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid #eee;
    
    h4 {
      margin: 0;
      color: $primary-color;
      font-size: 1.1rem;
    }
  }
  
  .equipment-details {
    margin-bottom: $spacing-sm;
  }
  
  .equipment-detail {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    
    .detail-label {
      color: $text-color;
      font-weight: 500;
    }
    
    .detail-value {
      color: $primary-color;
      font-weight: 600;
    }
  }
}

.add-equipment-form {
  background-color: #f8f9fa;
  padding: $spacing-md;
  border-radius: 20px;
  margin-bottom: $spacing-lg;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05) inset;
  
  h4 {
    margin-top: 0;
    margin-bottom: $spacing-md;
    color: $primary-color;
    font-size: 1.1rem;
  }
  
  @media (max-width: 767px) {
    padding: $spacing-sm;
    margin-bottom: $spacing-md;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-md;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: $spacing-sm;
  }
}

.form-group {
  margin-bottom: $spacing-md;
  
  label {
    display: block;
    margin-bottom: $spacing-xs;
    font-weight: 500;
    color: $text-color;
  }
  
  @media (max-width: 767px) {
    margin-bottom: $spacing-sm;
  }
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 30px;
  border: 1px solid #ddd;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 2px rgba($primary-color, 0.1);
  }
  
  &::placeholder {
    color: #aaa;
  }
}

.form-actions {
  display: flex;
  gap: $spacing-md;
  margin-top: $spacing-md;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: $spacing-sm;
  }
}

.btn-add, .btn-save, .btn-cancel {
  padding: 10px 20px;
  border-radius: 30px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  @media (max-width: 767px) {
    padding: 8px 16px;
  }
}

.btn-add {
  background-color: $primary-color;
  color: white;
  
  &:hover {
    background-color: darken($primary-color, 10%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

.btn-save {
  background-color: #27ae60;
  color: white;
  
  &:hover {
    background-color: darken(#27ae60, 10%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

.btn-cancel {
  background-color: #f1f1f1;
  color: $text-color;
  
  &:hover {
    background-color: #e0e0e0;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
}

/* Hide table on mobile and show cards instead */
@media (max-width: 480px) {
  .table {
    display: none;
  }
  
  .equipment-cards {
    display: flex;
  }
}

/* Chart container responsive adjustments */
.chart-container {
  height: 350px;
  
  @media (max-width: 767px) {
    height: 300px;
  }
  
  @media (max-width: 480px) {
    height: 250px;
  }
}
</style>
