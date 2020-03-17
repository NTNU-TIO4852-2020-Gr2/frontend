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
addScript("Axios", "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js");
addScript("jQuery", "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js");
addScript("Popper.js", "https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js", "sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo", "anonymous");
addScript("Bootstrap", "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js", "sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6", "anonymous");
addScript("Google Maps", "https://maps.googleapis.com/maps/api/js?key=" + config.googleMapsApiKey);
addScript("Chart.js", "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.bundle.min.js")
addScript("Moment.js", "lib/moment.min.js");

// App
addScript("App", "scripts/app.js");
addScript("Data", "scripts/data.js");
addScript("Map", "scripts/map.js");
addScript("Chart", "scripts/chart.js");
