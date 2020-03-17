// Requires config

const LOADING_STATUS_LOADING = "loading";
const LOADING_STATUS_FAILED = "failed";
const LOADING_STATUS_FINISHED = "finished";
const ALERT_SEVERITY_WARNING = "warning";
const ALERT_SEVERITY_CRITICAL = "critical";
const EMPTY_MEASUREMENT = {
  "id": null,
  "device": "",
  "time": "",
  "ph": null,
  "temperature": null,
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
    measurementsLoadingStatuses: {},
    alerts: {},
    alertsLoadingStatus: LOADING_STATUS_LOADING,
    map: null,
    mapMarkers: {},
    activeDevice: null,
    deviceFilter: null,
    detailsKey: 1,
    deviceListKey: 1,
    alertsKey: 1,
  },
  computed: {
    devicesFiltered() {
      return Object.fromEntries(Object.entries(app.devices).filter(([uuid, device]) => {
        if (!app.deviceFilter) {
          return true;
        }
        return device.name.toLowerCase().indexOf(app.deviceFilter.toLowerCase()) > -1
          || device.uuid.toLowerCase().indexOf(app.deviceFilter.toLowerCase()) > -1;
      }));
    },
    alertCount: function() {
      return Object.keys(app.alerts).length;
    },
  },
  watch: {
    devices: function(val) {
      app.updateDetails();
    },
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
      app.drawDeviceCharts();

      // Exit fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    },
    closeDetails: function(clearUrl=true) {
      app.activeDevice = null;
      if (clearUrl) {
        location.hash = "";
      }
      app.updatePageTitle(null);
    },
    postUpdateDevices: function() {
      app.deviceListKey++;
      app.updateMapDevices();
    },
    postUpdateMeasurements: function(deviceUuid=null) {
      app.deviceListKey++;
      let isForActiveDevice = deviceUuid && app.activeDevice && deviceUuid === app.activeDevice.uuid;
      if (isForActiveDevice)  {
        //app.detailsKey++;
        app.drawDeviceCharts();
      }
    },
    postUpdateAlerts: function() {
      //app.alertsKey++;
    },
    updateMapDevices: function() {
      window["updateMapDevices"]();
    },
    drawDeviceCharts: function() {
      window["drawDeviceCharts"]();
    },
    friendlyDeviceName: function(device) {
      return device.name ? device.name : device.uuid;
    },
    measurementsLoadingStatus: function(deviceUuid) {
      if (!(deviceUuid in app.measurementsLoadingStatuses)) {
        return LOADING_STATUS_LOADING;
      }
      return app.measurementsLoadingStatuses[deviceUuid];
    },
    activeDeviceMeasurementsLoaded: function() {
      return app.activeDevice && app.measurementsLoadingStatus(activeDevice.uuid) == LOADING_STATUS_FINISHED;
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
    parseMeasurements: function(device) {
      let timeValues = [];
      let phValues = [];
      let temperatureValues = [];
      let minPh = null;
      let maxPh = null;
      if (device.uuid in app.measurements) {
        Object.values(app.measurements[device.uuid]).forEach(measurement => {
          let formattedTime = app.$options.filters.formatDateTime(measurement.time);
          timeValues.unshift(formattedTime);
          phValues.unshift(measurement.ph);
          temperatureValues.unshift(measurement.temperature);
          if (minPh == null || measurement.ph < minPh) {
            minPh = measurement.ph;
          }
          if (maxPh == null || measurement.ph > maxPh) {
            maxPh = measurement.ph;
          }
        });
      }
      return {
        "timeValues": timeValues,
        "phValues": phValues,
        "temperatureValues": temperatureValues,
        "minPh": minPh,
        "maxPh": maxPh,
      };
    }
  },
  filters: {
    formatPh: function (value) {
      if (value) {
        return "pH " + value.toFixed(2);
      }
    },
    formatTemperature: function (value) {
      if (value) {
        return value.toFixed(2) + "\u2103";
      }
    },
    formatDateTime: function (value) {
      if (value) {
        return moment(String(value)).format("YYYY-MM-DD HH:mm");
      }
    },
  },
});

// Update Page URL
app.updatePageTitle(null);

// Listen for URL device changes
window.addEventListener("hashchange", function() {
  app.updateDetails();
});

// Update height when the window is resized
function updateSidebarHeight() {
  let sidebar = document.getElementsByClassName("sidebar-sticky")[0];
  let navbar = document.getElementsByClassName("navbar")[0];
  let windowHeight = window.innerHeight;
  let navbarHeight = navbar.offsetHeight;
  sidebar.style.top = navbarHeight + "px";
  sidebar.style.height = (windowHeight - navbarHeight) + "px";
}
window.addEventListener("load", updateSidebarHeight);
window.addEventListener("resize", updateSidebarHeight);
