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

// Update map markers for the devices
function updateMapDevices() {
  // Map not ready yet
  if (map == null)
    return;

  // TODO update for all devices and remove old

  // Marker
  let markerProps = {
    map: app.map,
    position: {lat: 63.419499, lng: 10.402077},
    //label: "A",
    deviceName: "Alpha",
    deviceUuid: 1,
  };
  let marker = new google.maps.Marker(markerProps);

  // Info window
  let infowindow =  new google.maps.InfoWindow({
    content: markerProps.deviceName,
    map: app.map
  });
  marker.addListener('click', onClickMapMarker);
  marker.addListener('mouseover', function() {
    infowindow.open(app.map, this);
  });
  marker.addListener('mouseout', function() {
    infowindow.close();
  });
}

function onClickMapMarker() {
  app.openDetails(this.deviceUuid);
}
