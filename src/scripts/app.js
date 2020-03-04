let app = new Vue({
  el: "#app",
  data: {
    // Config
    siteTitle: config.siteName,
    siteRootUrl: config.rootUrl,
    backendRootUrl: config.backendRootUrl,
    backendRootUrlFriendly: config.backendRootUrlFriendly,

    // State
    activeDeviceUuid: null,
    devices: {
      "1": {
        uuid: "1",
        name: "First",
        timeCreated: 0,
        latitude: 63.419499,
        longitude: 10.402077,
      },
      "2": {
        uuid: "2",
        name: "Second",
        timeCreated: 0,
        latitude: 63.419499,
        longitude: 10.412077,
      },
      "3": {
        uuid: "3",
        name: "Third",
        timeCreated: 0,
        latitude: 63.429499,
        longitude: 10.402077,
      },
    },
    map: null,
    mapMarkers: {},
  },
  computed: {
    deviceAlertCount: function() {
      // TODO
      return 0;
    },
  },
  watch: {
    // FIXME watch array elements too, not just the array itself
    devices: function () {
      window["updateMapDevices"]();
    },
  },
  methods: {
    openDetails: function(device) {
      if (typeof device === "object")
        app.activeDeviceUuid = device.uuid;
      else
        app.activeDeviceUuid = device;
      // Exit fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    },
    closeDetails: function() {
      app.activeDeviceUuid = null;
    },
  },
});
