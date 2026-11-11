// GitHub Pages deep-link fallback: hand the requested path to the app.
var path = window.location.pathname.replace('/057Cafe', '');
window.location.replace('/057Cafe/?redirect=' + encodeURIComponent(path));
