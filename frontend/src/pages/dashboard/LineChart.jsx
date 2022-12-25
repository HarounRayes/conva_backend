import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


function LineChartData() {
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
              label: 'Clients',
              backgroundColor: '#188932',
              borderColor: '#188932',
              data: [65, 59, 80, 81, 56, 55, 40],

            },
            {
              label: 'Drivers',
              backgroundColor: '#c73232',
              borderColor: '#c73232',
              data: [28, 48, 40, 19, 86, 27, 90],
            },
          ]
    }

    const options =  {
        scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              grid: {
                display: false
              }
            }
          },
        plugins: {
          legend: {
            display: false,
          },
        }
        
    }


  return <Line data={data} options={options} />
}

export default LineChartData;
