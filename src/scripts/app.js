// Requires config

const LOADING_STATUS_LOADING = "loading";
const LOADING_STATUS_FAILED = "failed";
const LOADING_STATUS_LOADED = "loaded";
const ALERT_SEVERITY_WARNING = "warning";
const ALERT_SEVERITY_CRITICAL = "critical";
const EMPTY_MEASUREMENT = {
  "id": "",
  "device": "",
  "time": "",
  "ph": "-",
  "temperature": "-",
};

let app = new Vue({
  el: "#app",
  data: {
    // Config
    siteTitle: config.siteName,
    siteRootUrl: config.rootUrl,
    backendRootUrl: config.backendRootUrl,
    backendRootUrlFriendly: config.backendRootUrlFriendly,

    // State
    devices: {},
    devicesLoadingStatus: LOADING_STATUS_LOADING,
    measurements: {},
    lastMeasurements: {},
    measurementsLoadingStatus: LOADING_STATUS_LOADING,
    alerts: {},
    alertsLoadingStatus: LOADING_STATUS_LOADING,
    map: null,
    mapMarkers: {},
    activeDevice: null,
  },
  computed: {
    alertCount: function() {
      return Object.keys(app.alerts).length;
    },
  },
  watch: {
    devices: function(newDevices) {
      app.updateDetails();
    }
  },
  methods: {
    updatePageTitle: function(subtitle) {
      if (subtitle) {
        document.title = app.siteTitle + " | " + subtitle;
      } else {
        document.title = app.siteTitle;
      }
    },
    updateDetails: function() {
      let uuid = location.hash.replace("#", "");
      if (uuid && uuid in app.devices) {
        app.openDetails(uuid);
      } else {
        app.closeDetails(false);
      }
    },
    openDetails: function(deviceOrUuid) {
      let uuid = null;
      if (typeof deviceOrUuid === "object")
        uuid = deviceOrUuid.uuid;
      else
        uuid = deviceOrUuid;
      
      // Open details
      let device = app.devices[uuid];
      app.activeDevice = device;
      location.hash = uuid;
      app.updatePageTitle(app.friendlyDeviceName(device));

      // Exit fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    },
    closeDetails: function(clearUrl=true) {
      app.updatePageTitle(null);
      app.activeDevice = null;
      if (clearUrl) {
        location.hash = "";
      }
      app.updatePageTitle(null);
    },
    postUpdateDevices: function() {
      window["updateMapDevices"]();
    },
    friendlyDeviceName: function(device) {
      return device.name ? device.name : device.uuid;
    },
    alertSeverityCssClass: function(severity) {
      switch(severity) {
        case "info":
          return "alert-primary";
        case "warning":
          return "alert-warning";
        case "critical":
          return "alert-danger";
        default:
          return "alert-dark";
      }
    },
    alertSeverityVerbose: function(severity) {
      switch(severity) {
        case "info":
          return "Info";
        case "warning":
          return "Warning";
        case "critical":
          return "Critical";
        default:
          return "Unknown";
      }
    },
    lastMeasurementForDevice: function(device) {
      if (device.uuid in app.lastMeasurements) {
        return app.lastMeasurements[device.uuid];
      }
      return EMPTY_MEASUREMENT;
    },
  },
});

app.updatePageTitle(null);

window.addEventListener('hashchange', function() {
  app.updateDetails();
}, false);
