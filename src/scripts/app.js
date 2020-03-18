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
    detailsUpdateKey: 0,
    deviceListUpdateKey: 0,
    alertsUpdateKey: 0,
    activeDeviceMeasurementsUpdateKey: 0,
    timeRangeUpdateKey: 0,
    timeRangeBeginDateRaw: "",
    timeRangeBeginTimeRaw: "",
    timeRangeEndDateRaw: "",
    timeRangeEndTimeRaw: "",
  },
  computed: {
    devicesFiltered() {
      return Object.fromEntries(Object.entries(this.devices).filter(([uuid, device]) => {
        if (!this.deviceFilter) {
          return true;
        }
        return device.name.toLowerCase().indexOf(this.deviceFilter.toLowerCase()) > -1
          || device.uuid.toLowerCase().indexOf(this.deviceFilter.toLowerCase()) > -1;
      }));
    },
    deviceCount() {
      return Object.keys(this.devices).length;
    },
    alertCount() {
      return Object.keys(this.alerts).length;
    },
    timeRangeBegin() {
      // Force update every time tick
      this.timeRangeUpdateKey;

      let rawDate = this.timeRangeBeginDateRaw;
      let rawTime = this.timeRangeBeginTimeRaw;
      let datetime = null;
      if (rawDate && rawTime) {
        datetime = moment(rawDate + " " + rawTime);
      } else if (rawDate) {
        datetime = moment(rawDate);
      } else if (rawTime) {
        datetime = moment(rawTime, ['HH:mm']);
      } else {
        datetime = moment();
      }

      // Default to one month ago and 24 hours ago if date/time not specified
      if (!rawDate) {
        datetime.subtract(1, 'months');
      }
      if (!rawTime) {
        datetime.subtract(24, 'hours');
      }

      return datetime.format();
    },
    timeRangeEnd() {
      // Force update every time tick
      this.timeRangeUpdateKey;
      
      let rawDate = this.timeRangeEndDateRaw;
      let rawTime = this.timeRangeEndTimeRaw;
      let datetime = null;
      if (rawDate && rawTime) {
        datetime = moment(rawDate + " " + rawTime);
      } else if (rawDate) {
        datetime = moment(rawDate);
      } else if (rawTime) {
        datetime = moment(rawTime, ['HH:mm']);
      } else {
        datetime = moment();
      }

      return datetime.format();
    },
    parsedActiveMeasurements() {
      // Force recompute on measurements update
      this.activeDeviceMeasurementsUpdateKey;

      let count = 0;
      let timeValues = [];
      let phValues = [];
      let temperatureValues = [];
      let minPh = null;
      let maxPh = null;
      let averagePh = null;
      let minTemperature = null;
      let maxTemperature = null;
      let averageTemperature = null;
      let device = this.activeDevice;
      if (device && device.uuid in this.measurements) {
        Object.values(this.measurements[device.uuid]).forEach(measurement => {
          // Skip if out of time range
          if (moment(measurement.time).isBefore(this.timeRangeBegin)
              || moment(measurement.time).isAfter(this.timeRangeEnd)) {
            return;
          }

          count++;
          timeValues.unshift(measurement.time);
          phValues.unshift(measurement.ph);
          temperatureValues.unshift(measurement.temperature);
          // pH
          if (measurement.ph != null) {
            if (minPh == null || measurement.ph < minPh) {
              minPh = measurement.ph;
            }
            if (maxPh == null || measurement.ph > maxPh) {
              maxPh = measurement.ph;
            }
            if (averagePh == null) {
              averagePh = measurement.ph;
            } else {
              averagePh += measurement.ph;
            }
          }
          // Temperature
          if (measurement.temperature != null) {
            if (minTemperature == null || measurement.temperature < minTemperature) {
              minTemperature = measurement.temperature;
            }
            if (maxTemperature == null || measurement.temperature > maxTemperature) {
              maxTemperature = measurement.temperature;
            }
            if (averageTemperature == null) {
              averageTemperature = measurement.temperature;
            } else {
              averageTemperature += measurement.temperature;
            }
          }
        });
        if (averagePh != null) {
          averagePh /= count;
        }
        if (averageTemperature != null) {
          averageTemperature /= count;
        }
      }
      return {
        "count": count,
        "timeValues": timeValues,
        "phValues": phValues,
        "temperatureValues": temperatureValues,
        "minPh": minPh,
        "maxPh": maxPh,
        "averagePh": averagePh,
        "minTemperature": minTemperature,
        "maxTemperature": maxTemperature,
        "averageTemperature": averageTemperature,
      };
    },
  },
  watch: {
    devices(val) {
      this.updateDetails();
    },
    timeRangeBeginDateRaw(val) {
      this.postUpdateTimeRange();
    },
    timeRangeBeginTimeRaw(val) {
      this.postUpdateTimeRange();
    },
    timeRangeEndDateRaw(val) {
      this.postUpdateTimeRange();
    },
    timeRangeEndTimeRaw(val) {
      this.postUpdateTimeRange();
    },
  },
  methods: {
    updatePageTitle(subtitle) {
      if (subtitle) {
        document.title = this.siteTitle + " | " + subtitle;
      } else {
        document.title = this.siteTitle;
      }
    },
    updateDetails() {
      let uuid = location.hash.replace("#", "");
      if (uuid && uuid in this.devices) {
        this.openDetails(uuid);
      } else {
        this.closeDetails(false);
      }
    },
    openDetails(deviceOrUuid) {
      let uuid = null;
      if (typeof deviceOrUuid === "object")
        uuid = deviceOrUuid.uuid;
      else
        uuid = deviceOrUuid;
      
      // Open details
      let device = this.devices[uuid];
      this.activeDevice = device;
      location.hash = uuid;
      this.updatePageTitle(this.friendlyDeviceName(device));
      this.drawDeviceCharts();

      // Exit fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    },
    closeDetails(clearUrl=true) {
      this.activeDevice = null;
      if (clearUrl) {
        location.hash = "";
      }
      this.updatePageTitle(null);
    },
    postUpdateDevices() {
      this.deviceListUpdateKey++;
      this.updateMapDevices();
    },
    postUpdateMeasurements(deviceUuid=null) {
      this.deviceListUpdateKey++;
      let isForActiveDevice = deviceUuid && this.activeDevice && deviceUuid === this.activeDevice.uuid;
      if (isForActiveDevice)  {
        //this.detailsUpdateKey++;
        this.drawDeviceCharts();
      }
    },
    postUpdateAlerts() {
      //this.alertsUpdateKey++;
    },
    updateMapDevices() {
      window["updateMapDevices"]();
    },
    postUpdateTimeRange() {
      this.drawDeviceCharts();
    },
    drawDeviceCharts() {
      window["drawDeviceCharts"]();
    },
    friendlyDeviceName(device) {
      return device.name ? device.name : device.uuid;
    },
    measurementsLoadingStatus(deviceUuid) {
      if (!(deviceUuid in this.measurementsLoadingStatuses)) {
        return LOADING_STATUS_LOADING;
      }
      return this.measurementsLoadingStatuses[deviceUuid];
    },
    activeDeviceMeasurementsLoaded() {
      return this.activeDevice && this.measurementsLoadingStatus(activeDevice.uuid) == LOADING_STATUS_FINISHED;
    },
    alertSeverityCssClass(severity) {
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
    alertSeverityVerbose(severity) {
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
    lastMeasurementForDevice(device) {
      if (device && device.uuid in this.lastMeasurements) {
        return this.lastMeasurements[device.uuid];
      }
      return EMPTY_MEASUREMENT;
    },
  },
  filters: {
    formatPh(value) {
      if (value) {
        return "pH " + value.toFixed(2);
      } else {
        return "?";
      }
    },
    formatTemperature(value) {
      if (value) {
        return value.toFixed(2) + "\u2103";
      } else {
        return "?";
      }
    },
    formatDateTime(value) {
      if (value) {
        return moment(String(value)).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "?";
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

// Periodically update time range
window.setInterval(function () {
  app.timeRangeUpdateKey++;
  app.postUpdateTimeRange();
}, config.timeRangeUpdateInterval * 1000);
