// Requires config and app

let temperatureCanvas = document.getElementById("temperature-chart");
let phCanvas = document.getElementById("ph-chart");

let temperatureChart = new Chart(temperatureCanvas.getContext('2d'), {
  type: 'line',
  data: {
    labels: [],
      datasets: [{
          label: 'Instant',
          backgroundColor: 'rgb(0, 0, 0, 0.0)',
          borderColor: 'rgb(150, 50, 150)',
          data: []
      }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  }
});

let phChart = new Chart(phCanvas.getContext('2d'), {
  type: 'line',
  data: {
    labels: [],
      datasets: [{
          label: 'Instant',
          backgroundColor: 'rgb(0, 0, 0, 0.0)',
          borderColor: 'rgb(150, 150, 50)',
          data: []
      }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  }
});

function drawDeviceCharts() {
  if (!app.activeDevice) {
    return;
  }

  let values = app.parseMeasurements(app.activeDevice);
  temperatureChart.data.labels = values.timeValues;
  temperatureChart.data.datasets[0].data = values.temperatureValues;
  phChart.data.labels = values.timeValues;
  phChart.data.datasets[0].data = values.phValues;
}
