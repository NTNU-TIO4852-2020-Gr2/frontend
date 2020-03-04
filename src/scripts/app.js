/*
 * TODO
 * Load Vue and Maps dynamically, based on debug and key.
 */

let app = new Vue({
  el: "#app",
  data: {
    // Config
    siteTitle: config.siteName,
    siteRootUrl: config.rootUrl,
    backendRootUrl: config.backendRootUrl,
    backendRootUrlFriendly: config.backendRootUrlFriendly,

    // State
    overviewAllOkay: true,
    activeDeviceUuid: "",
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
  }
});
