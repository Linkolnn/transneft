import { defineStore } from 'pinia';
import employeesData from '~/data/employees.json';

export const useEmployeesStore = defineStore('employees', {
  state: () => ({
    employees: [],
    locationSummary: {},
    positionSummary: {},
    loading: false,
    error: null
  }),
  
  getters: {
    allEmployees: (state) => state.employees,
    employeeCount: (state) => state.employees.length,
    
    // Filter employees by location
    employeesByLocation: (state) => (location) => {
      return state.employees.filter(employee => employee.location === location);
    },
    
    // Filter employees by work schedule
    employeesByWorkSchedule: (state) => (schedule) => {
      return state.employees.filter(employee => employee.workSchedule === schedule);
    },
    
    // Get unique positions
    uniquePositions: (state) => {
      const positions = state.employees.map(employee => employee.position);
      return [...new Set(positions)];
    },
    
    // Computed data for charts
    locationChartData: (state) => {
      return {
        labels: Object.keys(state.locationSummary),
        datasets: [
          {
            label: 'Сотрудники по локации',
            data: Object.values(state.locationSummary),
            backgroundColor: [
              'rgba(0, 86, 164, 0.7)',
              'rgba(39, 174, 96, 0.7)',
              'rgba(231, 76, 60, 0.7)'
            ],
            borderColor: [
              'rgba(0, 86, 164, 1)',
              'rgba(39, 174, 96, 1)',
              'rgba(231, 76, 60, 1)'
            ],
            borderWidth: 1
          }
        ]
      };
    },
    
    positionChartData: (state) => {
      return {
        labels: Object.keys(state.positionSummary),
        datasets: [
          {
            label: 'Сотрудники по должностям',
            data: Object.values(state.positionSummary),
            backgroundColor: [
              'rgba(52, 152, 219, 0.7)',
              'rgba(155, 89, 182, 0.7)',
              'rgba(241, 196, 15, 0.7)'
            ],
            borderColor: [
              'rgba(52, 152, 219, 1)',
              'rgba(155, 89, 182, 1)',
              'rgba(241, 196, 15, 1)'
            ],
            borderWidth: 1
          }
        ]
      };
    }
  },
  
  actions: {
    async fetchEmployees() {
      try {
        this.loading = true;
        this.error = null;
        
        // In a real application, this would be an API call
        // For this demo, we're using the imported JSON data
        this.employees = employeesData.employees;
        this.locationSummary = employeesData.locationSummary;
        this.positionSummary = employeesData.positionSummary;
        
        this.loading = false;
      } catch (error) {
        this.error = 'Ошибка при загрузке данных сотрудников';
        this.loading = false;
        console.error('Error fetching employees data:', error);
      }
    },
    
    updateEmployee(updatedEmployee) {
      const index = this.employees.findIndex(employee => employee.id === updatedEmployee.id);
      
      if (index !== -1) {
        this.employees[index] = updatedEmployee;
        this.updateSummaries();
      }
    },
    
    addEmployee(newEmployee) {
      // Generate a new ID based on the highest existing ID
      const maxId = Math.max(...this.employees.map(employee => employee.id), 0);
      const employeeWithId = {
        ...newEmployee,
        id: maxId + 1
      };
      
      this.employees.push(employeeWithId);
      this.updateSummaries();
    },
    
    removeEmployee(id) {
      this.employees = this.employees.filter(employee => employee.id !== id);
      this.updateSummaries();
    },
    
    // Recalculate summaries after changes
    updateSummaries() {
      // Update location summary
      this.locationSummary = this.employees.reduce((summary, employee) => {
        const location = employee.location;
        summary[location] = (summary[location] || 0) + 1;
        return summary;
      }, {});
      
      // For position summary, we'll simplify by using predefined categories
      const positionCategories = {
        'Главный инженер': 'Инженерно-технический персонал',
        'Инженер': 'Инженерно-технический персонал',
        'Инженер КИПиА': 'Инженерно-технический персонал',
        'Начальник участка': 'Инженерно-технический персонал',
        'Техник': 'Инженерно-технический персонал',
        'Специалист по охране труда': 'Инженерно-технический персонал',
        'Оператор': 'Рабочие специальности',
        'Механик': 'Рабочие специальности',
        'Слесарь': 'Рабочие специальности',
        'Электрик': 'Рабочие специальности',
        'Бухгалтер': 'Административный персонал',
        'Экономист': 'Административный персонал'
      };
      
      this.positionSummary = this.employees.reduce((summary, employee) => {
        const category = positionCategories[employee.position] || 'Другие';
        summary[category] = (summary[category] || 0) + 1;
        return summary;
      }, {});
    }
  }
});
