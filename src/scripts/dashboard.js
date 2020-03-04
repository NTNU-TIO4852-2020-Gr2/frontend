let map = null;

function initMap() {
  console.log("Initializing map ...");

  // mapOptions is defined in the HTML doc
  if (mapOptions == null) {
    console.error("Map options not set, map will not be loaded.")
    return;
  }

  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  updateMapDevices();
}

// Update map markers for the devices
function updateMapDevices() {
  // Map not ready yet
  if (map == null)
    return;

  console.log("Updating devices on map ...");
  let markerProps = {
    map: map,
    position: {lat: 63.419499, lng: 10.402077},
    //label: "A",
    deviceName: "Alpha",
    deviceId: 1,
  };
  let marker = new google.maps.Marker(markerProps);
  let infowindow =  new google.maps.InfoWindow({
    content: markerProps.deviceName,
    map: map
  });
  marker.addListener('click', onClickMapMarker);
  marker.addListener('mouseover', function() {
    infowindow.open(map, this);
  });
  marker.addListener('mouseout', function() {
    infowindow.close();
  });
}

function onClickMapMarker() {
  console.log(this.deviceName)
}

google.maps.event.addDomListener(window, 'load', initMap);
