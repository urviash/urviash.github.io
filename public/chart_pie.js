import chartStack from './chart_stack.js';

// Function to update legend position based on screen width
function updateLegendPosition(chart) {
    const isMobile = window.matchMedia('(max-width: 768px)').matches; // Adjust breakpoint as needed
    chart.options.plugins.legend.position = isMobile ? 'right' : 'bottom';
    chart.update();
}

function chartPie(data) {
  // 1. Sum total clean-ups by organization
  // Reducer written by ChatGPT-4o (OpenAI 2024)
  const organizationCount = data.reduce((acc, item) => {
    const org = item.organization;
    acc[org] = (acc[org] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(organizationCount);
  const eventCounts = Object.values(organizationCount);

  // Polar area chart
  const ctx = document.querySelector('#pieChart').getContext('2d');
  const pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Number of Clean-up Events',
        data: eventCounts,
        backgroundColor: [
          '#00796B', //dark teal
          '#8E24AA', //purple
          '#FFA726', //bright orange
          '#FBC02D', //warm yellow
          '#FF7043', //dark orange
          '#4FC3F7', //sky blue
          '#4DB6AC', //lt teal
          '#D81B60', //magenta
          '#FFD54F', //golden yellow
          '#1976D2', //deep blue
          '#009688', //med teal
          '#43A047', //green
          '#FFCA28' //soft amber
        ],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Number of litter collection events supported by organizations'
        }
      },
      onClick: function (event, elements) {
        // Check if a point was clicked
        const points = this.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);

        if (points.length) {
          // Get the clicked dataset index and data index
          const clickedElement = points[0];
          const dataIndex = clickedElement.index;

          // Retrieve the label (month/year) and data (number of bags)
          const label = labels[dataIndex];

          // Create the stack chart by district
          chartStack(data, {month: null, year: null, org: label, district: null});
        }
      },
    }
  });
}

export default chartPie;
