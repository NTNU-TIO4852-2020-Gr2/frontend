let app = new Vue({
  el: "#app",
  data: {
    // Config
    siteTitle: config.siteName,
    siteRootUrl: config.rootUrl,
    backendRootUrl: config.backendRootUrl,
    backendRootUrlFriendly: config.backendRootUrlFriendly,

    // State
    map: null,
    activeDeviceUuid: null,
    devices: [
      {
        uuid: "1",
        name: "First",
        timeCreated: 0,
        latitude: 0,
        longitude: 0,
      },
      {
        uuid: "2",
        name: "Second",
        timeCreated: 0,
        latitude: 0,
        longitude: 0,
      },
      {
        uuid: "3",
        name: "Third",
        timeCreated: 0,
        latitude: 0,
        longitude: 0,
      },
    ],
  },
  computed: {
    deviceAlertCount: function() {
      // TODO
      return 0;
    },
  },
  watch: {
    devices: function () {
      try {
        window["updateMapDevices"]();
      } catch (err) {
        // Ignored
      }
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
