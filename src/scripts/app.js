// Requires config

const LOADING_STATUS_LOADING = "loading";
const LOADING_STATUS_FAILED = "failed";
const LOADING_STATUS_LOADED = "loaded";

let app = new Vue({
  el: "#app",
  data: {
    // Config
    siteTitle: config.siteName,
    siteRootUrl: config.rootUrl,
    backendRootUrl: config.backendRootUrl,
    backendRootUrlFriendly: config.backendRootUrlFriendly,

    // State
    activeDevice: null,
    devices: {},
    devicesLoadingStatus: LOADING_STATUS_LOADING,
    measurements: {},
    measurementsLoadingStatus: LOADING_STATUS_LOADING,
    map: null,
    mapMarkers: {},
  },
  computed: {
    deviceAlertCount: function() {
      // TODO
      return 0;
    },
  },
  methods: {
    openDetails: function(device) {
      let uuid = null;
      if (typeof device === "object")
        uuid = device.uuid;
      else
        uuid = device;
      app.activeDevice = app.devices[uuid];
      // Exit fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    },
    closeDetails: function() {
      app.activeDevice = null;
    },
    postUpdateDevices: function() {
      window["updateMapDevices"]();
    }
  },
});
