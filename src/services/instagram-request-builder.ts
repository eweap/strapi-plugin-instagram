import { compile } from 'path-to-regexp';
import * as qs from 'query-string';

import { InstagramConfig } from '../config/instagram-api.config';
import { PluginConfig } from '../interfaces/plugin-config.interface';

const ENDPOINT_PATH = '/plugins/instagram/connect-endpoint';

export function getAdminUrl(): string {
    return strapi.config.get('admin.url');
}

export function getInstagramAppConfig(): PluginConfig {
    return strapi.plugins.instagram.config;
}

export function getRedirectUrl(): string {
    const { overrideAdminUrl } = this.getInstagramAppConfig();

    const redirectUrl = overrideAdminUrl || getAdminUrl();

    return `${redirectUrl}${ENDPOINT_PATH}`;
}

export function getInstagramUrl(
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
}

export function getAuthorizationPopupUrl() {
    const { facebookAppClientId } = this.getInstagramAppConfig();

    return this.getInstagramUrl('/oauth/authorize', {
        client_id: facebookAppClientId,
        response_type: 'code',
        scope: ['user_profile', 'user_media'].join(','),
        redirect_uri: this.getRedirectUrl(),
    });
}

export function getShortAccessTokenUrl(
    code: string
): { url: string; requestData: any } {
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
            redirect_uri: this.getRedirectUrl(),
        }),
    };

    return data;
}

export function getLongAccessTokenUrl(shortAccessToken: string): string {
    const { facebookAppClientSecret } = this.getInstagramAppConfig();

    return this.getInstagramUrl(
        '/access_token',
        {
            access_token: shortAccessToken,
            grant_type: 'ig_exchange_token',
            client_secret: facebookAppClientSecret,
        },
        InstagramConfig.graphRootUrl
    );
}

export function getRefreshLongAccessTokenUrl(longAccessToken: string) {
    return this.getInstagramUrl(
        '/access_token',
        {
            access_token: longAccessToken,
            grant_type: 'ig_refresh_token',
        },
        InstagramConfig.graphRootUrl
    );
}
