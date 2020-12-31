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
    const {
        overrideAdminUrl,
    } = InstagramRequestBuilder.getInstagramAppConfig();

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
    const {
        facebookAppClientId,
    } = InstagramRequestBuilder.getInstagramAppConfig();

    return InstagramRequestBuilder.getInstagramUrl('/oauth/authorize', {
        client_id: facebookAppClientId,
        response_type: 'code',
        scope: ['user_profile', 'user_media'].join(','),
        redirect_uri: InstagramRequestBuilder.getRedirectUrl(),
    });
};

const getShortAccessTokenUrl = function getShortAccessTokenUrl(
    code: string
): { url: string; requestData: any } {
    const {
        facebookAppClientId,
        facebookAppClientSecret,
    } = InstagramRequestBuilder.getInstagramAppConfig();

    const data = {
        url: InstagramRequestBuilder.getInstagramUrl('/oauth/access_token'),
        requestData: qs.stringify({
            client_id: facebookAppClientId,
            client_secret: facebookAppClientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: InstagramRequestBuilder.getRedirectUrl(),
        }),
    };

    return data;
};

const getLongAccessTokenUrl = function getLongAccessTokenUrl(
    shortAccessToken: string
): string {
    const {
        facebookAppClientSecret,
    } = InstagramRequestBuilder.getInstagramAppConfig();

    return InstagramRequestBuilder.getInstagramUrl(
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
    return InstagramRequestBuilder.getInstagramUrl(
        '/refresh_access_token',
        {
            grant_type: 'ig_refresh_token',
            access_token: longAccessToken,
        },
        InstagramConfig.graphRootUrl
    );
};

const InstagramRequestBuilder = {
    getAdminUrl,
    getInstagramAppConfig,
    getRedirectUrl,
    getInstagramUrl,
    getAuthorizationPopupUrl,
    getShortAccessTokenUrl,
    getLongAccessTokenUrl,
    getRefreshLongAccessTokenUrl,
};

export default InstagramRequestBuilder;
