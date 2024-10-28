// TO DO: Error page

import chartArea from './chart_area.js';
import chartPie from './chart_pie.js';
import chartBar from './chart_bar.js';

async function loadData(url) {
  try {
    const request = await fetch(url);
    const json = await request.json();
    return json;
  } catch(err){
    console.error(err);
  };
}

async function mainThread() {
  // const proxyUrl = `http://localhost:3000/api/data`;
  // There are 23646 rows of data total as of Oct 2024.
  const url = 'https://data.princegeorgescountymd.gov/resource/9tsa-iner.json?$limit=23646';
  const data = await loadData(url);
  // localStorage.setItem("data", data);

  chartArea(data);
  chartPie(data);
  chartBar(data);
}

document.addEventListener("DOMContentLoaded", async () => mainThread());
