let app = new Vue({
    el: "#app",
    data: {
        siteTitle: "PH2O",
        siteRootUrl: "./",
        apiRootUrl: "./",
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