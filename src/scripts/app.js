// Requires config

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
    measurements: {},
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
