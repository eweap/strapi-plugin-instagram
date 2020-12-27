import { compile } from 'path-to-regexp';
import * as qs from 'query-string';

import { InstagramConfig } from '../config/instagram-api.config';
import { PluginConfig } from '../interfaces/plugin-config.interface';

const ENDPOINT_PATH = '/plugins/instagram/connect-endpoint';

const getAdminUrl = function getAdminUrl(): string {
    return strapi.config.get('admin.url');
};

const getInstagramAppConfig = function getInstagramAppConfig(): PluginConfig {
    return strapi.plugins.instagram.config;
};

const getRedirectUrl = function getRedirectUrl(): string {
    const { overrideAdminUrl } = module.getInstagramAppConfig();

    const redirectUrl = overrideAdminUrl || getAdminUrl();

    return `${redirectUrl}${ENDPOINT_PATH}`;
};

const getInstagramUrl = function getInstagramUrl(
    path = '',
    queryParams = {},
    rootUrl = InstagramConfig.rootUrl
) {
    let url = rootUrl;
    const compiledPath = compile(path, { encode: encodeURIComponent });
    url = rootUrl + compiledPath();

    const queryString = qs.stringify(queryParams);

    if (queryString) {
        url = `${url}?${queryString}`;
    }

    return url;
};

const getAuthorizationPopupUrl = function getAuthorizationPopupUrl() {
    const { facebookAppClientId } = module.getInstagramAppConfig();

    return module.getInstagramUrl('/oauth/authorize', {
        client_id: facebookAppClientId,
        response_type: 'code',
        scope: ['user_profile', 'user_media'].join(','),
        redirect_uri: module.getRedirectUrl(),
    });
};

const getShortAccessTokenUrl = function getShortAccessTokenUrl(
    code: string
): { url: string; requestData: any } {
    const {
        facebookAppClientId,
        facebookAppClientSecret,
    } = module.getInstagramAppConfig();

    const data = {
        url: module.getInstagramUrl('/oauth/access_token'),
        requestData: qs.stringify({
            client_id: facebookAppClientId,
            client_secret: facebookAppClientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: module.getRedirectUrl(),
        }),
    };

    return data;
};

const getLongAccessTokenUrl = function getLongAccessTokenUrl(
    shortAccessToken: string
): string {
    const { facebookAppClientSecret } = module.getInstagramAppConfig();

    return module.getInstagramUrl(
        '/access_token',
        {
            access_token: shortAccessToken,
            grant_type: 'ig_exchange_token',
            client_secret: facebookAppClientSecret,
        },
        InstagramConfig.graphRootUrl
    );
};

const getRefreshLongAccessTokenUrl = function getRefreshLongAccessTokenUrl(
    longAccessToken: string
) {
    return module.getInstagramUrl(
        '/access_token',
        {
            access_token: longAccessToken,
            grant_type: 'ig_refresh_token',
        },
        InstagramConfig.graphRootUrl
    );
};

const module = {
    getAdminUrl,
    getInstagramAppConfig,
    getRedirectUrl,
    getInstagramUrl,
    getAuthorizationPopupUrl,
    getShortAccessTokenUrl,
    getLongAccessTokenUrl,
    getRefreshLongAccessTokenUrl,
};

export default module;
