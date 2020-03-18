// Requires config

function addScript(name, src, integrity=null, crossorigin=null) {
  if (config.debug) {
    console.log("Adding script \"" + name + "\": " + src);
  }
  let script = document.createElement('script');
  script.defer = true;
  script.async = false;
  script.setAttribute("src", src);
  if (integrity)
    script.setAttribute("integrity", integrity);
  if (crossorigin)
    script.setAttribute("crossorigin", crossorigin);
  let container = document.getElementById("scripts");
  container.appendChild(script);
}

// Dependencies
if (config.debug) {
  addScript("Vue.js (dev)", "https://cdn.jsdelivr.net/npm/vue/dist/vue.js");
} else {
  addScript("Vue.js (prod)", "https://cdn.jsdelivr.net/npm/vue");
}
addScript("Axios", "lib/axios.min.js");
addScript("jQuery", "lib/jquery.min.js");
addScript("Popper.js", "lib/popper.min.js");
// Requires jQuery and Popper.js
addScript("Bootstrap", "lib/bootstrap.min.js");
addScript("Google Maps", "https://maps.googleapis.com/maps/api/js?key=" + config.googleMapsApiKey);
addScript("Moment.js", "lib/moment.min.js");
// Requires Moment.js
addScript("Chart.js", "lib/Chart.min.js");

// App
addScript("App", "scripts/app.js");
addScript("Data", "scripts/data.js");
addScript("Map", "scripts/map.js");
addScript("Chart", "scripts/chart.js");
