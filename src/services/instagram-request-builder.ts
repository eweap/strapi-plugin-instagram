import { compile } from 'path-to-regexp';
import * as qs from 'query-string';

import { PluginConfig } from '../interfaces/plugin-config.interface';

const SERVER_URL = strapi.config.get('server.url');

export const INSTAGRAM_ROOT_URL = 'https://api.instagram.com';
export const GRAPH_ROOT_URL = 'https://graph.instagram.com';
const ENDPOINT_PATH = '/admin/plugins/instagram/connect-endpoint';
const REDIRECT_URL = `${SERVER_URL}${ENDPOINT_PATH}`;

export function getInstagramAppConfig(): PluginConfig {
    return strapi.plugins.instagram.config;
}

export function getInstagramUrl(
    path = '',
    queryParams = {},
    rootUrl = this.rootUrl
) {
    let url = rootUrl;
    const compiledPath = compile(path, { encode: encodeURIComponent });
    url = rootUrl + compiledPath();

    const queryString = qs.stringify(queryParams);

    if (queryString) {
        url = `${url}?${queryString}`;
    }

    return url;
}

export function getAuthorizationPopupUrl() {
    const { facebookAppClientId } = this.getInstagramAppConfig();

    return this.getInstagramUrl('/oauth/authorize', {
        client_id: facebookAppClientId,
        response_type: 'code',
        scope: ['user_profile', 'user_media'].join(','),
        redirect_uri: REDIRECT_URL,
    });
}

export function getShortAccessTokenUrl(code: string) {
    const {
        facebookAppClientId,
        facebookAppClientSecret,
    } = this.getInstagramAppConfig();

    const data = {
        url: this.getInstagramUrl('/oauth/access_token'),
        requestData: qs.stringify({
            client_id: facebookAppClientId,
            client_secret: facebookAppClientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URL,
        }),
    };

    return data;
}

export function getLongAccessTokenUrl(shortAccessToken: string) {
    const { facebookAppClientSecret } = this.getInstagramAppConfig();

    return this.getInstagramUrl(
        '/access_token',
        {
            access_token: shortAccessToken,
            grant_type: 'ig_exchange_token',
            client_secret: facebookAppClientSecret,
        },
        this.graphRootUrl
    );
}

export function getRefreshLongAccessTokenUrl(longAccessToken: string) {
    return this.getInstagramUrl(
        '/access_token',
        {
            access_token: longAccessToken,
            grant_type: 'ig_refresh_token',
        },
        this.graphRootUrl
    );
}
