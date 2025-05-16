export default defineNuxtPlugin((nuxtApp) => {
  // This plugin is used to register global components and functions related to canvas charts
  
  // Add a function to convert store data to canvas chart format
  const convertToCanvasChartData = (chartData) => {
    if (!chartData || !chartData.datasets || !chartData.labels) {
      return { labels: [], values: [] };
    }
    
    // For simplicity, we'll use the first dataset
    const dataset = chartData.datasets[0];
    
    return {
      labels: chartData.labels,
      values: dataset.data
    };
  };
  
  // Add a function to convert location summary to canvas chart format
  const convertLocationSummaryToCanvasData = (locationSummary) => {
    return {
      labels: Object.keys(locationSummary),
      values: Object.values(locationSummary)
    };
  };
  
  // Add a function to convert position summary to canvas chart format
  const convertPositionSummaryToCanvasData = (positionSummary) => {
    return {
      labels: Object.keys(positionSummary),
      values: Object.values(positionSummary)
    };
  };
  
  // Provide these functions to the app
  return {
    provide: {
      convertToCanvasChartData,
      convertLocationSummaryToCanvasData,
      convertPositionSummaryToCanvasData
    }
  };
});
