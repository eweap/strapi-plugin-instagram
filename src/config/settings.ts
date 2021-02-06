import { PluginConfig } from '../interfaces/plugin-config.interface';

const defaultPluginConfig: PluginConfig = {
    facebookAppClientId: 'YOUR_FACEBOOK_APP_CLIENT_ID',
    facebookAppClientSecret: 'YOUR_FACEBOOK_APP_CLIENT_SECRET',

    // Optionnal
    // ex: 'https://GROK_ID.eu.ngrok.io/admin',
    overrideAdminUrl: null,
};

export = defaultPluginConfig;
