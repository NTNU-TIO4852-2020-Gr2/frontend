// Requires config and app

const httpClient = axios.create();
httpClient.defaults.timeout = config.dataFetchInterval;

function fetchDevices() {
  let endpoint = config.backendRootUrl + config.backendDevicesEndpoint;
  httpClient.get(endpoint)
    .then(response => {
      parseDeviceData(response.data);
      app.devicesLoadingStatus = LOADING_STATUS_LOADED;
    })
    .catch(error => {
      app.devicesLoadingStatus = LOADING_STATUS_FAILED;
      console.error("Failed to fetch and parse devices: " + endpoint);
      console.error(error);
    });
};

function parseDeviceData(data) {
  let devices = {};
  for (i = 0; i < data.length; i++) {
    let rawDevice = data[i];
    let device = {};
    let uuid = rawDevice["uuid"];
    device["uuid"] = uuid;
    device["name"] = rawDevice["name"];
    device["longitude"] = rawDevice["longitude"];
    device["latitude"] = rawDevice["latitude"];
    device["timeCreated"] = rawDevice["time_created"];
    devices[uuid] = device;
  }
  if (config.debug)
    console.log("Loaded " + Object.keys(devices).length + " devices.");
  app.devices = devices;
  app.postUpdateDevices();
}

function fetchMeasurements() {
  let endpoint = config.backendRootUrl + config.backendMeasurementsEndpoint;
  httpClient.get(endpoint)
    .then(response => {
      parseMeasurementData(response.data);
      app.measurementsLoadingStatus = LOADING_STATUS_LOADED;
    })
    .catch(error => {
      app.measurementsLoadingStatus = LOADING_STATUS_FAILED;
      console.error("Failed to fetch and parse measurements: " + endpoint);
      console.error(error);
    });
};

function parseMeasurementData(data) {
  let measurements = {};
  let lastMeasurements = {};
  let count = 0;
  for (i = 0; i < data.length; i++) {
    let rawMeasurement = data[i];
    let measurement = {};
    let deviceUuid = rawMeasurement["device"];
    measurement["id"] = rawMeasurement["id"];
    measurement["device"] = deviceUuid;
    measurement["time"] = rawMeasurement["time"];
    measurement["ph"] = rawMeasurement["ph"];
    measurement["temperature"] = rawMeasurement["temperature"];

    let deviceMeasurements = measurements[deviceUuid];
    if (!deviceMeasurements) {
      deviceMeasurements = [];
      measurements[deviceUuid] = deviceMeasurements;
    }
    deviceMeasurements.push(measurement);

    lastMeasurements[deviceUuid] = measurement;

    count++;
  }

  app.measurements = measurements;
  app.lastMeasurements = lastMeasurements;

  if (config.debug)
    console.log("Loaded " + count + " measurements.");
}

function fetchAlerts() {
  let endpoint = config.backendRootUrl + config.backendAlertsEndpoint;
  // FIXME dummy data
  app.alerts = {
    "0": {
      "id": "0",
      "device": "d09df169-52f6-4724-8f3e-dd6557970e44",
      "severity": "warning",
      "message": "Some value out of range, I guess.",
    },
    "3": {
      "id": "3",
      "device": "2d1042a3-2eea-43f4-a3d3-1f1992e6ad7f",
      "severity": "critical",
      "message": "Very bad! 😱",
    },
    "50": {
      "id": "50",
      "device": "2d1042a3-2eea-43f4-a3d3-1f1992e6a555",
      "severity": "info",
      "message": "Some info?",
    },
    "10000": {
      "id": "10000",
      "device": "2d1042a3-2eea-43f4-a3d3-1f191326a555",
      "severity": "whatever",
      "message": "Some unknown severity.",
    },
  };
  app.alertsLoadingStatus = LOADING_STATUS_LOADED;
};

function fetchAll() {
  if (config.debug)
    console.log("Fetching everything ...");
  fetchDevices();
  fetchMeasurements();
  fetchAlerts();
}

// Start now and periodically
fetchAll();
window.setInterval(function () {
  fetchAll();
}, config.dataFetchInterval);
