import { defineStore } from 'pinia';
import equipmentData from '~/data/equipment.json';

export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    equipment: [],
    revisionHistory: [],
    loading: false,
    error: null
  }),
  
  getters: {
    allEquipment: (state) => state.equipment,
    equipmentCount: (state) => state.equipment.length,
    totalEquipment: (state) => state.equipment.reduce((total, item) => total + item.total, 0),
    equipmentUnderRevision: (state) => state.equipment.reduce((total, item) => total + item.underRevision, 0),
    operationalEquipment: (state) => state.equipment.reduce((total, item) => total + item.operational, 0),
    revisionData: (state) => state.revisionHistory,
    
    // Computed data for charts
    equipmentChartData: (state) => {
      return {
        labels: state.equipment.map(item => item.name),
        datasets: [
          {
            label: 'Общее количество',
            data: state.equipment.map(item => item.total),
            backgroundColor: 'rgba(0, 86, 164, 0.7)'
          },
          {
            label: 'На ревизии',
            data: state.equipment.map(item => item.underRevision),
            backgroundColor: 'rgba(231, 76, 60, 0.7)'
          }
        ]
      };
    },
    
    revisionChartData: (state) => {
      return {
        labels: state.revisionHistory.map(item => item.month),
        datasets: [
          {
            label: 'Завершенные ревизии',
            data: state.revisionHistory.map(item => item.completed),
            backgroundColor: 'rgba(39, 174, 96, 0.7)',
            borderColor: 'rgba(39, 174, 96, 1)',
            borderWidth: 1
          }
        ]
      };
    }
  },
  
  actions: {
    async fetchEquipment() {
      try {
        this.loading = true;
        this.error = null;
        
        // In a real application, this would be an API call
        // For this demo, we're using the imported JSON data
        this.equipment = equipmentData.equipment;
        this.revisionHistory = equipmentData.revisionHistory;
        
        this.loading = false;
      } catch (error) {
        this.error = 'Ошибка при загрузке данных оборудования';
        this.loading = false;
        console.error('Error fetching equipment data:', error);
      }
    },
    
    updateEquipment(updatedEquipment) {
      const index = this.equipment.findIndex(item => item.id === updatedEquipment.id);
      
      if (index !== -1) {
        this.equipment[index] = updatedEquipment;
      }
    },
    
    addEquipment(newEquipment) {
      // Generate a new ID based on the highest existing ID
      const maxId = Math.max(...this.equipment.map(item => item.id), 0);
      const equipmentWithId = {
        ...newEquipment,
        id: maxId + 1
      };
      
      this.equipment.push(equipmentWithId);
    },
    
    removeEquipment(id) {
      this.equipment = this.equipment.filter(item => item.id !== id);
    }
  }
});
