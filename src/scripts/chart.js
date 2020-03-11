// Requires config and app

const CHART_MIN_PH = 0;
const CHART_MAX_PH = 14;

const phChartOptions = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
        label: "Temperature (\u2103)",
        backgroundColor: 'rgb(0, 0, 0, 0.0)',
        borderColor: 'rgb(150, 0, 150)',
        data: [],
    }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
          ticks: {
            maxTicksLimit: 20,
          },
      }],
      yAxes: [{
          ticks: {
            maxTicksLimit: 6,
          },
      }],
    },
  },
};

const temperatureChartOptions = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
        label: "Temperature (\u2103)",
        backgroundColor: 'rgb(0, 0, 0, 0.0)',
        borderColor: 'rgb(0, 150, 150)',
        data: [],
    }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
          ticks: {
            maxTicksLimit: 20,
          },
      }],
      yAxes: [{
          ticks: {
            maxTicksLimit: 6,
          },
      }],
    },
  },
};

let phChart = null;
let temperatureChart = null;

function drawDeviceCharts() {
  if (!app.activeDevice) {
    return;
  }

  if (!phChart) {
    let phCanvas = document.getElementById("ph-chart");
    phChart = new Chart(phCanvas.getContext('2d'), phChartOptions);
  }
  if (!temperatureChart) {
    let temperatureCanvas = document.getElementById("temperature-chart");
    temperatureChart = new Chart(temperatureCanvas.getContext('2d'), temperatureChartOptions);
  }

  let values = app.parseMeasurements(app.activeDevice);

  temperatureChart.data.labels = values.timeValues;
  temperatureChart.data.datasets[0].data = values.temperatureValues;
  temperatureChart.data.datasets[0].borderColor = 'rgb(0, 150, 150)';
  temperatureChart.data.datasets[0].backgroundColor = 'rgba(0, 150, 150, 0.1)';
  temperatureChart.update();

  let minPh = CHART_MIN_PH;
  if (values.minPh && values.minPh > CHART_MIN_PH) {
    minPh = values.minPh;
  }
  let maxPh = CHART_MAX_PH;
  if (values.maxPh && values.maxPh < CHART_MAX_PH) {
    maxPh = values.maxPh;
  }

  phChart.data.labels = values.timeValues;
  phChart.data.datasets[0].data = values.phValues;
  phChart.data.datasets[0].borderColor = 'rgb(150, 0, 150)';
  phChart.data.datasets[0].backgroundColor = 'rgba(150, 0, 150, 0.05)';
  phChart.options.scales.yAxes[0].ticks["min"] = minPh;
  phChart.options.scales.yAxes[0].ticks["max"] = maxPh;
  phChart.update();
}
