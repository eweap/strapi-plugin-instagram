import * as pluginPkg from '../../package.json';

const pluginId = pluginPkg.name.replace(/^strapi-plugin-/i, '');

export = pluginId;
