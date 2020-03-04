// Configuration template for EiT front-end
// Copy this file to config.js and add config options there.

window.app.config = {
    debug: false,
    siteName: "PH20",
    rootUrl: "./",

    // Backend
    backendRootUrl: "http://localhost:9000",
    backendRootUrlFriendly: backendRootUrl,

    // Google Maps
    googleMapsApiKey: "",
    googleMapsLatitude: "63.419499",
    googleMapsLongitude: "10.402077",
    googleMapsZoom: "10",
    // roadmap, satellite, hybrid or terrain
    googleMapsType: "terrain",
};
