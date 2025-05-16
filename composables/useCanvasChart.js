export function useCanvasChart() {
  // Function to draw a bar chart on canvas
  const drawBarChart = (canvas, data, options = {}) => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { 
      width = canvas.width, 
      height = canvas.height,
      padding = 40,
      barColors = ['#0056a4', '#e74c3c', '#27ae60', '#f39c12'],
      title = '',
      animate = true,
      fontSize = 16,
      valueFontSize = 12,
      labelFontSize = 12
    } = options;
    
    // Adjust padding based on container size
    const responsivePadding = width < 400 ? 20 : width < 600 ? 30 : padding;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set dimensions
    const chartWidth = width - responsivePadding * 2;
    const chartHeight = height - responsivePadding * 2;
    
    // Find max value for scaling
    const maxValue = Math.max(...data.values);
    
    // Calculate bar width based on number of data points
    const barWidth = chartWidth / data.labels.length - 10;
    
    // Draw title
    if (title) {
      ctx.fillStyle = '#333';
      ctx.font = `${fontSize}px Roboto, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, responsivePadding / 2);
    }
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(responsivePadding, responsivePadding);
    ctx.lineTo(responsivePadding, height - responsivePadding);
    ctx.lineTo(width - responsivePadding, height - responsivePadding);
    ctx.strokeStyle = '#ccc';
    ctx.stroke();
    
    // Draw bars with animation if enabled
    const drawBars = (progress = 1) => {
      // Calculate spacing between bars based on container width
      const barSpacing = width < 400 ? 5 : width < 600 ? 8 : 10;
      
      data.labels.forEach((label, index) => {
        const value = data.values[index];
        const barHeight = (value / maxValue) * chartHeight * progress;
        const x = responsivePadding + index * (barWidth + barSpacing);
        const y = height - responsivePadding - barHeight;
        
        // Draw bar
        ctx.fillStyle = barColors[index % barColors.length];
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw value on top of bar
        ctx.fillStyle = '#333';
        ctx.font = `${valueFontSize}px Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(value, x + barWidth / 2, y - 5);
        
        // Draw label below bar
        ctx.font = `${labelFontSize}px Roboto, sans-serif`;
        ctx.fillText(label, x + barWidth / 2, height - responsivePadding + 15);
      });
    };
    
    if (animate) {
      let progress = 0;
      const animationDuration = 1000; // ms
      const startTime = Date.now();
      
      const animateChart = () => {
        const currentTime = Date.now();
        progress = Math.min((currentTime - startTime) / animationDuration, 1);
        
        ctx.clearRect(0, 0, width, height);
        
        // Redraw title and axes
        if (title) {
          ctx.fillStyle = '#333';
          ctx.font = `${fontSize}px Roboto, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(title, width / 2, responsivePadding / 2);
        }
        
        ctx.beginPath();
        ctx.moveTo(responsivePadding, responsivePadding);
        ctx.lineTo(responsivePadding, height - responsivePadding);
        ctx.lineTo(width - responsivePadding, height - responsivePadding);
        ctx.strokeStyle = '#ccc';
        ctx.stroke();
        
        drawBars(progress);
        
        if (progress < 1) {
          requestAnimationFrame(animateChart);
        }
      };
      
      animateChart();
    } else {
      drawBars();
    }
  };
  
  // Function to draw a pie chart on canvas
  const drawPieChart = (canvas, data, options = {}) => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { 
      width = canvas.width, 
      height = canvas.height,
      colors = ['#0056a4', '#e74c3c', '#27ae60', '#f39c12', '#9b59b6'],
      title = '',
      animate = true,
      donut = false,
      donutWidth = 50,
      fontSize = 16,
      labelFontSize = 12
    } = options;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate total value
    const total = data.values.reduce((sum, value) => sum + value, 0);
    
    // Set center and radius
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    // Draw title
    if (title) {
      ctx.fillStyle = '#333';
      ctx.font = `${fontSize}px Roboto, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(title, centerX, 20);
    }
    
    // Draw pie/donut chart with animation if enabled
    const drawPie = (progress = 1) => {
      let startAngle = -Math.PI / 2; // Start from top
      
      data.values.forEach((value, index) => {
        const sliceAngle = (value / total) * Math.PI * 2 * progress;
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        
        // If donut, cut out center
        if (donut) {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius - donutWidth, startAngle, startAngle + sliceAngle);
          ctx.closePath();
          
          ctx.fillStyle = '#fff';
          ctx.fill();
        }
        
        // Calculate position for label
        const midAngle = startAngle + sliceAngle / 2;
        const angleSize = sliceAngle / (Math.PI * 2);
        
        // Draw label
        if (angleSize > 0.2) { // Only draw label if segment is large enough
          const labelRadius = donut ? radius - donutWidth / 2 : radius / 1.5;
          const labelX = centerX + Math.cos(midAngle) * labelRadius * progress;
          const labelY = centerY + Math.sin(midAngle) * labelRadius * progress;
          
          ctx.fillStyle = '#fff';
          ctx.font = `${labelFontSize}px Roboto, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Only show label if segment is visible during animation
          if (progress > 0.2) {
            // Adjust text for small screens
            const displayLabel = width < 400 && data.labels[index].length > 8 
              ? data.labels[index].substring(0, 7) + '...' 
              : data.labels[index];
            ctx.fillText(displayLabel, labelX, labelY);
          }
        }
        
        startAngle += sliceAngle;
      });
    };
    
    if (animate) {
      let progress = 0;
      const animationDuration = 1000; // ms
      const startTime = Date.now();
      
      const animateChart = () => {
        const currentTime = Date.now();
        progress = Math.min((currentTime - startTime) / animationDuration, 1);
        
        ctx.clearRect(0, 0, width, height);
        
        // Redraw title
        if (title) {
          ctx.fillStyle = '#333';
          ctx.font = `${fontSize}px Roboto, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(title, centerX, 20);
        }
        
        drawPie(progress);
        
        if (progress < 1) {
          requestAnimationFrame(animateChart);
        }
      };
      
      animateChart();
    } else {
      drawPie();
    }
  };
  
  // Function to draw a line chart on canvas
  const drawLineChart = (canvas, data, options = {}) => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { 
      width = canvas.width, 
      height = canvas.height,
      padding = 40,
      lineColor = '#0056a4',
      pointColor = '#e74c3c',
      title = '',
      animate = true,
      gridLines = true,
      fontSize = 16,
      labelFontSize = 10,
      valueFontSize = 12,
      pointRadius = 5,
      lineWidth = 2
    } = options;
    
    // Adjust padding based on container size
    const responsivePadding = width < 400 ? 25 : width < 600 ? 35 : padding;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set dimensions
    const chartWidth = width - responsivePadding * 2;
    const chartHeight = height - responsivePadding * 2;
    
    // Find max value for scaling
    const maxValue = Math.max(...data.values);
    
    // Calculate point spacing based on number of data points
    const pointSpacing = chartWidth / (data.labels.length - 1);
    
    // Draw title
    if (title) {
      ctx.fillStyle = '#333';
      ctx.font = `${fontSize}px Roboto, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, responsivePadding / 2);
    }
    
    // Draw grid or axes
    if (gridLines) {
      const gridCount = 5;
      
      // Horizontal grid lines
      for (let i = 0; i <= gridCount; i++) {
        const y = responsivePadding + (chartHeight / gridCount) * i;
        
        ctx.beginPath();
        ctx.moveTo(responsivePadding, y);
        ctx.lineTo(width - responsivePadding, y);
        ctx.strokeStyle = '#eee';
        ctx.stroke();
        
        // Draw y-axis labels
        const value = Math.round(maxValue - (maxValue / gridCount) * i);
        ctx.fillStyle = '#666';
        ctx.font = `${labelFontSize}px Roboto, sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText(value, responsivePadding - 5, y + 3);
      }
      
      // Vertical grid lines
      for (let i = 0; i < data.labels.length; i++) {
        const x = responsivePadding + pointSpacing * i;
        
        ctx.beginPath();
        ctx.moveTo(x, responsivePadding);
        ctx.lineTo(x, height - responsivePadding);
        ctx.strokeStyle = '#eee';
        ctx.stroke();
        
        // Draw x-axis labels
        ctx.fillStyle = '#666';
        ctx.font = `${labelFontSize}px Roboto, sans-serif`;
        ctx.textAlign = 'center';
        
        // Truncate or rotate labels on small screens
        const displayLabel = width < 400 && data.labels[i].length > 4 
          ? data.labels[i].substring(0, 3) + '...' 
          : data.labels[i];
          
        ctx.fillText(displayLabel, x, height - responsivePadding + 15);
      }
    } else {
      // Draw axes
      ctx.beginPath();
      ctx.moveTo(responsivePadding, responsivePadding);
      ctx.lineTo(responsivePadding, height - responsivePadding);
      ctx.lineTo(width - responsivePadding, height - responsivePadding);
      ctx.strokeStyle = '#ccc';
      ctx.stroke();
      
      // Draw x-axis labels
      data.labels.forEach((label, index) => {
        const x = responsivePadding + pointSpacing * index;
        
        ctx.fillStyle = '#666';
        ctx.font = `${labelFontSize}px Roboto, sans-serif`;
        ctx.textAlign = 'center';
        
        // Truncate or rotate labels on small screens
        const displayLabel = width < 400 && label.length > 4 
          ? label.substring(0, 3) + '...' 
          : label;
          
        ctx.fillText(displayLabel, x, height - responsivePadding + 15);
      });
    }
    
    // Draw line with animation if enabled
    const drawLine = (progress = 1) => {
      ctx.beginPath();
      
      data.values.forEach((value, index) => {
        const x = responsivePadding + pointSpacing * index;
        const y = height - responsivePadding - (value / maxValue) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          // For animation, only draw up to the current progress point
          if (index / (data.values.length - 1) <= progress) {
            ctx.lineTo(x, y);
          }
        }
      });
      
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      
      // Draw points
      data.values.forEach((value, index) => {
        // For animation, only draw points up to the current progress
        if (index / (data.values.length - 1) <= progress) {
          const x = responsivePadding + pointSpacing * index;
          const y = height - responsivePadding - (value / maxValue) * chartHeight;
          
          ctx.beginPath();
          ctx.arc(x, y, pointRadius, 0, Math.PI * 2);
          ctx.fillStyle = pointColor;
          ctx.fill();
          
          // Draw value above point
          ctx.fillStyle = '#333';
          ctx.font = `${valueFontSize}px Roboto, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(value, x, y - (pointRadius + 5));
        }
      });
    };
    
    if (animate) {
      let progress = 0;
      const animationDuration = 1500; // ms
      const startTime = Date.now();
      
      const animateChart = () => {
        const currentTime = Date.now();
        progress = Math.min((currentTime - startTime) / animationDuration, 1);
        
        ctx.clearRect(0, 0, width, height);
        
        // Redraw title
        if (title) {
          ctx.fillStyle = '#333';
          ctx.font = `${fontSize}px Roboto, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(title, width / 2, responsivePadding / 2);
        }
        
        // Redraw grid or axes
        if (gridLines) {
          const gridCount = 5;
          
          // Horizontal grid lines
          for (let i = 0; i <= gridCount; i++) {
            const y = responsivePadding + (chartHeight / gridCount) * i;
            
            ctx.beginPath();
            ctx.moveTo(responsivePadding, y);
            ctx.lineTo(width - responsivePadding, y);
            ctx.strokeStyle = '#eee';
            ctx.stroke();
            
            // Draw y-axis labels
            const value = Math.round(maxValue - (maxValue / gridCount) * i);
            ctx.fillStyle = '#666';
            ctx.font = `${labelFontSize}px Roboto, sans-serif`;
            ctx.textAlign = 'right';
            ctx.fillText(value, responsivePadding - 5, y + 3);
          }
          
          // Vertical grid lines
          for (let i = 0; i < data.labels.length; i++) {
            const x = responsivePadding + pointSpacing * i;
            
            ctx.beginPath();
            ctx.moveTo(x, responsivePadding);
            ctx.lineTo(x, height - responsivePadding);
            ctx.strokeStyle = '#eee';
            ctx.stroke();
            
            // Draw x-axis labels
            ctx.fillStyle = '#666';
            ctx.font = `${labelFontSize}px Roboto, sans-serif`;
            ctx.textAlign = 'center';
            
            // Truncate labels on small screens
            const displayLabel = width < 400 && data.labels[i].length > 4 
              ? data.labels[i].substring(0, 3) + '...' 
              : data.labels[i];
              
            ctx.fillText(displayLabel, x, height - responsivePadding + 15);
          }
        } else {
          // Draw axes
          ctx.beginPath();
          ctx.moveTo(responsivePadding, responsivePadding);
          ctx.lineTo(responsivePadding, height - responsivePadding);
          ctx.lineTo(width - responsivePadding, height - responsivePadding);
          ctx.strokeStyle = '#ccc';
          ctx.stroke();
          
          // Draw x-axis labels
          data.labels.forEach((label, index) => {
            const x = responsivePadding + pointSpacing * index;
            
            ctx.fillStyle = '#666';
            ctx.font = `${labelFontSize}px Roboto, sans-serif`;
            ctx.textAlign = 'center';
            
            // Truncate labels on small screens
            const displayLabel = width < 400 && label.length > 4 
              ? label.substring(0, 3) + '...' 
              : label;
              
            ctx.fillText(displayLabel, x, height - responsivePadding + 15);
          });
        }
        
        drawLine(progress);
        
        if (progress < 1) {
          requestAnimationFrame(animateChart);
        }
      };
      
      animateChart();
    } else {
      drawLine();
    }
  };
  
  return {
    drawBarChart,
    drawPieChart,
    drawLineChart
  };
}
