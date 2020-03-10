// Requires config and app

const httpClient = axios.create();
httpClient.defaults.timeout = config.dataFetchInterval;

function fetchDevices() {
  let endpoint = config.backendRootUrl + config.backendDevicesEndpoint;
  let url = endpoint + "?ordering=name";
  httpClient.get(url).then(response => {
      parseDeviceData(response.data);
      app.devicesLoadingStatus = LOADING_STATUS_FINISHED;
    }).catch(error => {
      parseDeviceData({});
      app.devicesLoadingStatus = LOADING_STATUS_FAILED;
      console.error("Failed to fetch and parse devices: " + endpoint);
      console.error(error);
    }).finally(() => {
      // Then load other stuff
      fetchAllMeasurements();
      fetchAlerts();
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

function fetchAllMeasurements() {
  let endpoint = config.backendRootUrl + config.backendMeasurementsEndpoint;
  // Remove for old devices
  Object.keys(app.measurements).slice().forEach(uuid => {
    if (!(uuid in app.devices)) {
      parseMeasurementData(uuid, {});
    }
  });

  // Fetch for current and new devices
  Object.keys(app.devices).forEach(uuid => {
    fetchDeviceMeasurements(endpoint, uuid);
  });
};

function fetchDeviceMeasurements(endpoint, deviceUuid) {
  if (app.devicesLoadingStatus !== LOADING_STATUS_FINISHED) {
    app.measurementsLoadingStatuses[deviceUuid] = LOADING_STATUS_FAILED;
    parseMeasurementData(deviceUuid, {});
    return;
  }

  let url = endpoint + "?device=" + deviceUuid + "&max_count=" + config.measurementsMaxCount
  httpClient.get(url)
    .then(response => {
      parseMeasurementData(deviceUuid, response.data);
      app.measurementsLoadingStatuses[deviceUuid] = LOADING_STATUS_FINISHED;
    })
    .catch(error => {
      parseMeasurementData(deviceUuid, {});
      app.measurementsLoadingStatuses[deviceUuid] = LOADING_STATUS_FAILED;
      console.error("Failed to fetch and parse measurements: " + url);
      console.error(error);
    });
};

function parseMeasurementData(deviceUuid, data) {
  let deviceMeasurements = [];
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

    if (deviceUuid != deviceUuid) {
      // Wrong device
      continue;
    }

    deviceMeasurements.push(measurement);
    count++;
  }

  if (count > 0) {
    app.measurements[deviceUuid] = deviceMeasurements;
    app.lastMeasurements[deviceUuid] = deviceMeasurements[0];
  } else {
    delete app.measurements[deviceUuid];
    delete app.lastMeasurements[deviceUuid];
  }

  if (config.debug)
    console.log("Loaded " + count + " measurements for device " + deviceUuid + ".");
}

function fetchAlerts() {
  if (app.devicesLoadingStatus !== LOADING_STATUS_FINISHED) {
    app.alertsLoadingStatus = LOADING_STATUS_FAILED;
    // FIXME
    //parseAlertsData({});
    app.alerts = {};
    return;
  }

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
  app.alertsLoadingStatus = LOADING_STATUS_FINISHED;
};

// Fetch now and periodically
fetchDevices();
window.setInterval(function () {
  fetchDevices();
}, config.dataFetchInterval);
