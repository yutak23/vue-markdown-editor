const fs = require('fs-extra');
const path = require('path');
const packageJson = require('../package.json');

const version = process.env.VERSION || packageJson.version;
const tips = '// This file is auto generated by build/build-entry.js';

const entryFiles = ['base-editor', 'codemirror-editor', 'preview'];

function buildEntry(filename) {
  const content = `${tips}
import Component from './${filename}.vue';

const version = '${version}';

const install = (Vue) => {
  Vue.component(Component.name, Component);
};

Component.version = version;
Component.install = install;
Component.use = function (optionsOrInstall) {
  if (typeof optionsOrInstall === 'function') {
    optionsOrInstall(Component);
  } else {
    optionsOrInstall.install(Component);
  }
};

if (typeof window !== 'undefined' && window.Vue && window.VMdTheme) {
  Component.use(window.VMdTheme);

  install(window.Vue);
}

export default Component;
`;

  fs.writeFileSync(path.join(__dirname, `../src/${filename}.js`), content);
}

entryFiles.forEach((filename) => {
  buildEntry(filename);
});

module.exports = {
  entryFiles,
};
