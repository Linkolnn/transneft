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
      animate = true
    } = options;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set dimensions
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Find max value for scaling
    const maxValue = Math.max(...data.values);
    
    // Calculate bar width based on number of data points
    const barWidth = chartWidth / data.labels.length - 10;
    
    // Draw title
    if (title) {
      ctx.fillStyle = '#333';
      ctx.font = '16px Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, padding / 2);
    }
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#ccc';
    ctx.stroke();
    
    // Draw bars with animation if enabled
    const drawBars = (progress = 1) => {
      data.labels.forEach((label, index) => {
        const value = data.values[index];
        const barHeight = (value / maxValue) * chartHeight * progress;
        const x = padding + index * (barWidth + 10);
        const y = height - padding - barHeight;
        
        // Draw bar
        ctx.fillStyle = barColors[index % barColors.length];
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw value on top of bar
        ctx.fillStyle = '#333';
        ctx.font = '12px Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(value, x + barWidth / 2, y - 5);
        
        // Draw label below bar
        ctx.fillText(label, x + barWidth / 2, height - padding + 15);
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
          ctx.font = '16px Roboto, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(title, width / 2, padding / 2);
        }
        
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
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
      donutWidth = 50
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
      ctx.font = '16px Roboto, sans-serif';
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
        const labelAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius + 20;
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;
        
        // Draw label and percentage
        ctx.fillStyle = '#333';
        ctx.font = '12px Roboto, sans-serif';
        ctx.textAlign = 'center';
        const percentage = Math.round((value / total) * 100);
        ctx.fillText(`${data.labels[index]} (${percentage}%)`, labelX, labelY);
        
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
          ctx.font = '16px Roboto, sans-serif';
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
      gridLines = true
    } = options;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set dimensions
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Find max value for scaling
    const maxValue = Math.max(...data.values);
    
    // Calculate point spacing based on number of data points
    const pointSpacing = chartWidth / (data.labels.length - 1);
    
    // Draw title
    if (title) {
      ctx.fillStyle = '#333';
      ctx.font = '16px Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, padding / 2);
    }
    
    // Draw grid lines
    if (gridLines) {
      const gridCount = 5;
      
      // Horizontal grid lines
      for (let i = 0; i <= gridCount; i++) {
        const y = padding + (chartHeight / gridCount) * i;
        
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.strokeStyle = '#eee';
        ctx.stroke();
        
        // Draw y-axis labels
        const value = Math.round(maxValue - (maxValue / gridCount) * i);
        ctx.fillStyle = '#666';
        ctx.font = '10px Roboto, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(value, padding - 5, y + 3);
      }
      
      // Vertical grid lines
      for (let i = 0; i < data.labels.length; i++) {
        const x = padding + pointSpacing * i;
        
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.strokeStyle = '#eee';
        ctx.stroke();
        
        // Draw x-axis labels
        ctx.fillStyle = '#666';
        ctx.font = '10px Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(data.labels[i], x, height - padding + 15);
      }
    } else {
      // Draw axes
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.strokeStyle = '#ccc';
      ctx.stroke();
      
      // Draw x-axis labels
      data.labels.forEach((label, index) => {
        const x = padding + pointSpacing * index;
        
        ctx.fillStyle = '#666';
        ctx.font = '10px Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, height - padding + 15);
      });
    }
    
    // Draw line with animation if enabled
    const drawLine = (progress = 1) => {
      // Draw line connecting points
      ctx.beginPath();
      
      data.values.forEach((value, index) => {
        const x = padding + pointSpacing * index;
        const y = height - padding - (value / maxValue) * chartHeight;
        
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
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw points
      data.values.forEach((value, index) => {
        // For animation, only draw points up to the current progress
        if (index / (data.values.length - 1) <= progress) {
          const x = padding + pointSpacing * index;
          const y = height - padding - (value / maxValue) * chartHeight;
          
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fillStyle = pointColor;
          ctx.fill();
          
          // Draw value above point
          ctx.fillStyle = '#333';
          ctx.font = '12px Roboto, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(value, x, y - 10);
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
          ctx.font = '16px Roboto, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(title, width / 2, padding / 2);
        }
        
        // Redraw grid or axes
        if (gridLines) {
          const gridCount = 5;
          
          // Horizontal grid lines
          for (let i = 0; i <= gridCount; i++) {
            const y = padding + (chartHeight / gridCount) * i;
            
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.strokeStyle = '#eee';
            ctx.stroke();
            
            // Draw y-axis labels
            const value = Math.round(maxValue - (maxValue / gridCount) * i);
            ctx.fillStyle = '#666';
            ctx.font = '10px Roboto, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(value, padding - 5, y + 3);
          }
          
          // Vertical grid lines
          for (let i = 0; i < data.labels.length; i++) {
            const x = padding + pointSpacing * i;
            
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.strokeStyle = '#eee';
            ctx.stroke();
            
            // Draw x-axis labels
            ctx.fillStyle = '#666';
            ctx.font = '10px Roboto, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(data.labels[i], x, height - padding + 15);
          }
        } else {
          // Draw axes
          ctx.beginPath();
          ctx.moveTo(padding, padding);
          ctx.lineTo(padding, height - padding);
          ctx.lineTo(width - padding, height - padding);
          ctx.strokeStyle = '#ccc';
          ctx.stroke();
          
          // Draw x-axis labels
          data.labels.forEach((label, index) => {
            const x = padding + pointSpacing * index;
            
            ctx.fillStyle = '#666';
            ctx.font = '10px Roboto, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(label, x, height - padding + 15);
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
