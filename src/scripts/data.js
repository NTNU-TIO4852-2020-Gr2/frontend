// Requires config and app

function fetchDevices() {
    let endpoint = config.backendRootUrl + config.backendDevicesEndpoint;
    axios.get(endpoint)
        .then(response => {
            parseDeviceData(response.data);
        })
        .catch(error => {
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
        if (config.debug)
            console.log("Loaded device: " + device.uuid + " / " + device.name);
    }
    if (config.debug)
        console.log("Loaded " + Object.keys(devices).length + " devices.");
    app.devices = devices;
    app.postUpdateDevices();
}

function fetchMeasurements() {
    let endpoint = config.backendRootUrl + config.backendMeasurementsEndpoint;
    axios.get(endpoint)
        .then(response => {
            parseMeasurementData(response.data);
        })
        .catch(error => {
            console.error("Failed to fetch and parse measurements: " + endpoint);
            console.error(error);
        });
};

function parseMeasurementData(data) {
    let measurements = {};
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

        count++;
    }
    if (config.debug)
        console.log("Loaded " + count + " measurements.");
    app.measurements = measurements;
}

fetchDevices();
fetchMeasurements();
