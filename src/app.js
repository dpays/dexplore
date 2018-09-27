// Styles
import "./stylesheets/app-light.scss";
import "./stylesheets/app-dark.scss";

// Small helpers you might want to keep
import "./helpers/context_menu.js";
import "./helpers/external_links.js";

import electron from "electron";

// Prevent dropped file from opening in window
document.addEventListener('dragover', function (event) {
  event.preventDefault();
  return false;
}, false);

document.addEventListener('drop', function (event) {
  event.preventDefault();
  return false;
}, false);


// A http server for dPayID redirect urls
import {startHelperServer} from "./helpers/dpayid-server-helper";
startHelperServer();


require('./ng-app.js');


window.onload = () => {
  setTimeout(() => {
    document.body.style.visibility = 'visible';
  }, 300);
};
