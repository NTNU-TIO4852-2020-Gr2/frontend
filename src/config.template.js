// Configuration template for EiT front-end
// Copy this file to config.js and add config options there.

const config = {
    // General
    debug: false,
    siteName: "PH20",
    rootUrl: "/",
    dataFetchInterval: 30, // s
    measurementsMaxCount: 500, // per device
    timeRangeUpdateInterval: 10, // s

    // Backend
    backendRootUrl: "http://localhost:9001/v0/",
    backendRootUrlFriendly: "http://localhost:9001/",
    backendDevicesEndpoint: "devices",
    backendMeasurementsEndpoint: "measurements",
    backendAlertsEndpoint: "alerts",

    // Google Maps
    googleMapsApiKey: "",
    googleMapsLatitude: 63.419499,
    googleMapsLongitude: 10.402077,
    googleMapsZoom: 10,
    // roadmap, satellite, hybrid or terrain
    googleMapsType: "terrain",
};
