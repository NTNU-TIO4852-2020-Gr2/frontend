// Update page title
document.title = config.siteName;
document.write(config.siteName);

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
addScript("jQuery", "https://code.jquery.com/jquery-3.2.1.slim.min.js", "sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN", "anonymous");
addScript("Popper.js", "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js", "sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q", "anonymous");
addScript("Bootstrap", "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js", "sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl", "anonymous");
addScript("Google Maps", "https://maps.googleapis.com/maps/api/js?key=" + config.googleMapsApiKey);

// App
addScript("App", "scripts/app.js");
addScript("Map", "scripts/data.js");
addScript("Map", "scripts/map.js");
