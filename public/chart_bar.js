import chartStack from './chart_stack.js'

function chartBar(data) {
  const districtCount = data.reduce((acc, item) => {
    const district = item.council_district;
    acc[district] = (acc[district] || 0) + 1;
    return acc;
  }, {});

  const raw_labels = Object.keys(districtCount);
  const labels = raw_labels.map(label => {
    return label.toLowerCase() === "undefined" ? "Unspecified" : 'District ' + label;
  })
  const eventCounts = Object.values(districtCount);

  const ctx = document.querySelector('#barChart').getContext('2d');
  const barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Number of Cleanup Events',
        data: eventCounts,
        backgroundColor: [
          '#00796B', //dark teal
          '#8E24AA', //purple
          '#FFA726', //bright orange
          '#009688', //med teal
          '#FF7043', //dark orange
          '#4FC3F7', //sky blue
          '#4DB6AC', //lt teal
          '#D81B60', //magenta
          '#FFD54F', //golden yellow
          '#1976D2', //deep blue
          '#FBC02D', //warm yellow
          '#43A047', //green
          '#FFCA28' //soft amber
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Number of litter collection events per PG district'
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
          const label = raw_labels[dataIndex];

          // Create the stack chart by district
          chartStack(data, {month: null, year: null, org: null, district: label});
        }
      },
    }
  });
}

export default chartBar;
