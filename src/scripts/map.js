// Initialize map after Google Maps is loaded
function initMap() {
  console.log("Initializing map ...");

  let mapOptions = {
    center: {lat: config.googleMapsLatitude, lng: config.googleMapsLongitude},
    zoom: config.googleMapsZoom,
    mapTypeId: config.googleMapsType,
  };
  app.map = new google.maps.Map(document.getElementById('map'), mapOptions);

  updateMapDevices();
}

google.maps.event.addDomListener(window, 'load', initMap);

// Update map markers for all devices
function updateMapDevices() {
  if (map == null)
    return;

  // Remove old markers
  Object.keys(app.mapMarkers).slice().forEach(uuid => {
    if (!(uuid in app.devices))
      app.mapMarkers[uuid].setMap(null);
      delete app.mapMarkers[uuid];
  });

  // Add and update existing markers
  Object.keys(app.devices).forEach(uuid => updateMapDevice(uuid));
}

// Update map marker for a particular device
function updateMapDevice(deviceUuid) {
  if (map == null)
    return;

  let device = app.devices[deviceUuid];
  let marker = app.mapMarkers[deviceUuid]; // Nullable

  let markerProps = {
    map: app.map,
    position: {lat: device.latitude, lng: device.longitude},
    //label: "A",
    deviceName: device.name,
    deviceUuid: device.uuid,
  };

  if (!marker) {
    // Marker
    marker = new google.maps.Marker(markerProps);
    app.mapMarkers[deviceUuid] = marker;

    // Info window
    let infowindow =  new google.maps.InfoWindow({
      content: markerProps.deviceName,
      map: app.map
    });
    marker.addListener('click', function () {
      app.openDetails(this.deviceUuid);
    });
    marker.addListener('mouseover', function() {
      infowindow.open(app.map, this);
    });
    marker.addListener('mouseout', function() {
      infowindow.close();
    });
  } else {
    marker.position = markerProps.position;
    marker.deviceName = markerProps.deviceName;
  }
}
