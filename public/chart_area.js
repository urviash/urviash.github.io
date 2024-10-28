/* TO DO:
** Add image fill plugin
** Change cursor on data point hover
** Change tooltip for data point hover
*/

import chartStack from './chart_stack.js'

function chartArea(data) {
  // const data = localStorage.getItem("data");

  // const labels = data.map(item => new Date(item.creationdate));
  // const totalBags = data.map(item => parseInt(item.total_bags_litter));
  //
  // console.log(labels);
  // console.log(totalBags);

  // 1. Sum total bags by month
  // Reducer written by ChatGPT-4o (OpenAI 2024)
  const aggregatedData = data.reduce((acc, item) => {
      const date = new Date(item.creationdate);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const totalBags = parseInt(item.total_bags_litter);

      if (!acc[monthYear]) {
          acc[monthYear] = totalBags;
      } else {
          acc[monthYear] += totalBags;
      }

      return acc;
  }, {});

  const labels = Object.keys(aggregatedData).map(monthYear => new Date(`${monthYear}-01`)); // Convert "YYYY-MM" to Date object
  const totalBagsPerMonth = Object.values(aggregatedData); // Extract the sum of bags for each month

  // Create the area chart
  const ctx = document.querySelector('#areaChart').getContext('2d');
  const areaChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels, // Months on X-axis
      datasets: [{
        label: 'Total Bags of Litter',
        data: totalBagsPerMonth, // Total bags per month on Y-axis
        fill: true, // To get AUC
        pointBackgroundColor: '#8E24AA', //purple
        backgroundColor: '#4DB6AC', //lt teal
        borderColor: '#4DB6AC', //lt teal
        tension: 0.4 // Smooth curve
      }]
    },
    options: {
      scales: {
        x: {
          type: 'time', // Make the x-axis time-based
          time: {
            unit: 'month', // Customize to 'day', 'month', etc.
          },
          title: {
            display: true,
            text: 'Date of Cleanup'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Total Bags of Litter'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Bags of litter collected per month in PGC'
        }
      },
      onClick: function (event, elements, labels) {
            // Check if a point was clicked
            const points = this.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);

            if (points.length) {
                // Get the clicked dataset index and data index
                const clickedElement = points[0];
                const dataIndex = clickedElement.index;

                // Retrieve the label (month/year) and data (number of bags)
                const label = Object.keys(aggregatedData)[dataIndex];

                // Split label to get the month and year
                const [year, month] = label.split('-');

                // Create the stack chart with the month and year
                chartStack(data, {month: month, year: year, org: null, district: null});
            }
        },
    }
  });
}

export default chartArea;
