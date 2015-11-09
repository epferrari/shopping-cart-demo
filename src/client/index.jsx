

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

// remove this in production
window.LiveReloadOptions = { host: "localhost" };
require('livereload-js');

var App = require("./app.jsx");
