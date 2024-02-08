/* REACT */
import React, { useEffect, useRef } from 'react';

/* CHART */
import Chart from 'chart.js/auto';

const PieChart = ({ date, datasets }) => {
    const chartContainer = useRef(null);
  
    useEffect(() => {
      if (chartContainer && chartContainer.current && date && datasets) {
        const data = {
          datasets: datasets
        };
  
        const config = {
          type: 'pie',
          data: data,
        };
  
        const myChart = new Chart(chartContainer.current, config);
  
        return () => {
          myChart.destroy();
        };
      }
    }, [datasets, date]);
  
    return <canvas ref={chartContainer} width={"auto"} height={"auto"}/>;
  };

export default PieChart;