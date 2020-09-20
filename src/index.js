import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

import '@babel/polyfill';
import 'overlayscrollbars/css/OverlayScrollbars.css';

import Navigate from './helpers/Navigate';
import Routes from './data/Routes';
import Config from 'electron-json-config';
import IsDev from './data/IsDev';
import defaultConfig from './data/default-config';
import GetInstalledAddons from './helpers/AddonInstaller/GetInstalledAddons';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');

root.id = 'root';
document.body.appendChild(root);

// Now we can render our application into it
render(<App />, document.getElementById('root'));

if (IsDev) InitialiseDeveloperFunctions();

function InitialiseDeveloperFunctions() {
  window.__navigate = Navigate;
  window.__routes = Routes;
  window.__config = Config;
  window.__resetConfig = () => {
    Config.purge();
    Config.setBulk(defaultConfig);
  };
  window.__getInstalledAddons = GetInstalledAddons;
}
