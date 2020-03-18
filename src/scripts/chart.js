// Requires config and app

const CHART_MIN_PH = 0;
const CHART_MAX_PH = 14;

const phChartOptions = {
  type: "line",
  data: {
    labels: [],
    datasets: [{
        label: "pH",
        backgroundColor: "rgb(0, 0, 0, 0.0)",
        borderColor: "rgb(150, 0, 150)",
        data: [],
    }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: false
    },
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        type: "time",
        time: {
          bounds: "ticks",
          unit: "hour",
          displayFormats: {
            hour: "YYYY-MM-DD HH:MM",
          },
        },
        ticks: {
          maxTicksLimit: 20,
        },
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "pH",
        },
        ticks: {
          maxTicksLimit: 9,
        },
      }],
    },
  },
};

const temperatureChartOptions = {
  type: "line",
  data: {
    labels: [],
    datasets: [{
        label: "Temperature (\u2103)",
        backgroundColor: "rgb(0, 0, 0, 0.0)",
        borderColor: "rgb(0, 150, 150)",
        data: [],
    }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: false
    },
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        type: "time",
        time: {
          bounds: "ticks",
          unit: "hour",
          displayFormats: {
            hour: "YYYY-MM-DD HH:MM",
          },
        },
        ticks: {
          maxTicksLimit: 20,
        },
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "\u2103",
        },
        ticks: {
          maxTicksLimit: 9,
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
    phChart = new Chart(phCanvas.getContext("2d"), phChartOptions);
  }
  if (!temperatureChart) {
    let temperatureCanvas = document.getElementById("temperature-chart");
    temperatureChart = new Chart(temperatureCanvas.getContext("2d"), temperatureChartOptions);
  }

  let values = app.parseMeasurements(app.activeDevice);

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
  phChart.options.scales.xAxes[0].ticks["min"] = app.timeRange.begin;
  phChart.options.scales.xAxes[0].ticks["max"] = app.timeRange.end;
  phChart.options.scales.yAxes[0].ticks["min"] = minPh;
  phChart.options.scales.yAxes[0].ticks["max"] = maxPh;
  phChart.update();

  temperatureChart.data.labels = values.timeValues;
  temperatureChart.data.datasets[0].data = values.temperatureValues;
  temperatureChart.options.scales.xAxes[0].ticks["min"] = app.timeRange.begin;
  temperatureChart.options.scales.xAxes[0].ticks["max"] = app.timeRange.end;
  temperatureChart.update();
}
