function addScript(name, src, integrity=null, crossorigin=null) {
  console.log("Adding script \"" + name + "\": " + src);
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
addScript("jQuery", "https://code.jquery.com/jquery-3.4.1.slim.min.js", "sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n", "anonymous");
addScript("Popper.js", "https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js", "sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo", "anonymous");
addScript("Bootstrap", "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js", "sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6", "anonymous");
addScript("Google Maps", "https://maps.googleapis.com/maps/api/js?key=" + config.googleMapsApiKey);

// App
addScript("App", "scripts/app.js");
addScript("Map", "scripts/data.js");
addScript("Map", "scripts/map.js");
