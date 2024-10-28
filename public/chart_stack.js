let stackedChart = null;
let title = '';
let tireBags = 0;
const TIRE_TARGET = 1000;

function updateTireCount(n) {
  tireBags += n;
  document.querySelector('#tireBags').innerText = tireBags;
}

function filterData(data, contextParams) {
  const month = contextParams.month;
  const year = contextParams.year;
  const org = contextParams.org;
  const district = contextParams.district;

  const filteredData = data.filter(item => {
    if(month && year) {
      title = `Types of trash collected in PG County in ${month}-${year}`
      // Filter data by month and year if clicked on area chart.
      const date = new Date(item.creationdate);
      return date.getMonth() === parseInt(month) - 1 && date.getFullYear() === parseInt(year);
    } else if (org) {
      title = `Types of trash collected in PG County by ${org}`
      // Filter data by organization if clicked on polar area chart.
      return item.organization === org;
    } else if (district) {
      title = `Types of trash collected in PG County District ${district}`
      // Filter data by district if clicked on bar chart.
      return item.council_district === district;
    } else {
      console.error('Orphan stack chart call!')
    }
  });

  return filteredData;
}

// contextParams: {month: string, year: string, org: string, district: string}
function chartStack(data, contextParams) {

  // Filter data for the context being viewed from.
        const filteredData = filterData(data, contextParams);

        // Parse the trash types and count the number of events each type was part of
        const trashTypeBags = {};

        filteredData.forEach(item => {
          const trashTypes = item.type_litter.split(',').map(type => type.trim());
          const filteredTypes = trashTypes?.filter(type => type !== 'bags_garbage');
          filteredTypes.forEach(type => {
            if (trashTypeBags[type]) {
              trashTypeBags[type] += parseInt(item.total_bags_litter);
            } else {
              trashTypeBags[type] = parseInt(item.total_bags_litter);
            }
          });
        });

        const trashTypes = Object.keys(trashTypeBags);

        const stackColors = [
          '#00796B', //dark teal
          '#FFA726', //bright orange
          '#8E24AA', //purple
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
        ];

        const datasets = trashTypes.map((type, index) => ({

            label: type,
            data: [trashTypeBags[type]],
            backgroundColor: stackColors[index]
        }));

        // Chart.js configuration
        const config = {
            type: 'bar',
            data: {
                labels: [''],
                datasets: datasets
            },
            options: {
                indexAxis: 'y', // Makes it horizontal
                scales: {
                    x: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Number of bags'
                        }
                    },
                    y: {
                        stacked: true,
                        title: {
                            display: false,
                            text: 'Trash types'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                      display: true,
                      text: title
                    }
                },
                onClick: function (event, elements) {
                  // Check if a point was clicked
                  const points = this.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);

                  if (tireBags < TIRE_TARGET && points.length) {
                    // Get the clicked dataset index and data index
                    const clickedElement = points[0];
                    const dataIndex = clickedElement.datasetIndex;

                    const trashType = trashTypes[dataIndex];

                    if (trashType === 'tires') {
                      const bags = this.data.datasets[dataIndex].data[0];
                      updateTireCount(bags);

                      if(tireBags >= TIRE_TARGET) {
                        window.alert("You're a pro! Pick up more tires with PGC Volunteering!");
                        document.querySelector('#prompt').innerHTML = `
                          <p>You're a pro!</p>
                          <p>Pick up more tires with <a href="https://www.princegeorgescountymd.gov/FormCenter/Environment-7/LITTERFREEPGC-Volunteer-Portal-87" target="_blank">PGC Volunteering</a></p>
                        `
                      }
                    }
                  }
                }
              }
        };

        // Render the chart
        const ctx = document.querySelector('#stackedChart').getContext('2d');

        if(stackedChart) {
          stackedChart.destroy();
        }

        stackedChart = new Chart(ctx, config);
}

export default chartStack;
