import axios from 'axios';

import { InstagramAuthorizationData } from '../interfaces/authorization-data.interface';

export async function handleAuthorizationCode(code: string) {
    try {
        const {
            access_token: short_access_token,
            user_id,
        } = await requestShortAccessToken(code);
        const {
            access_token: long_access_token,
            token_type,
            expires_in,
        } = await requestLongAccessToken(short_access_token);

        await saveAuthorizationData({
            user_id,
            code,
            long_access_token,
            token_type,
            expires_in,
        });

        return true;
    } catch (error) {
        const errorMessage =
            error?.response?.data?.error_message || error.toString();

        strapi.log.error(
            `❌ Instagram Plugin -> Failed retrieving short access token (${errorMessage})`
        );
        return false;
    }
}

export async function saveAuthorizationData(data: InstagramAuthorizationData) {
    const pluginStore = strapi.store({
        environment: strapi.config.environment,
        type: 'plugin',
        name: 'instagram',
    });

    await pluginStore.set({
        key: 'authorization',
        value: data,
    });
}

export async function requestShortAccessToken(code: string) {
    const { url, requestData } = await strapi.plugins.instagram.services[
        'instagram-request-builder'
    ].getShortAccessTokenUrl(code);

    try {
        const { data } = await axios.post(url, requestData);

        return data;
    } catch (error) {
        const errorMessage =
            error?.response?.data?.error_message || error.toString();

        strapi.log.error(
            `❌ Instagram Plugin -> Failed retrieving short access token (${errorMessage})`
        );

        return null;
    }
}

export async function requestLongAccessToken(shortAccessToken: string) {
    const url = await strapi.plugins.instagram.services[
        'instagram-request-builder'
    ].getLongAccessTokenUrl(shortAccessToken);

    const { data } = await axios.get(url);

    return {
        access_token: data['access-token'],
        token_type: data['token-type'],
        expires_in: data['expires-in'],
    };
}

export async function refreshLongAccessToken(longAccessToken: string) {
    const url = await strapi.plugins.instagram.services[
        'instagram-request-builder'
    ].getRefreshLongAccessTokenUrl(longAccessToken);

    const { data } = await axios.get(url);

    return {
        access_token: data['access-token'],
        token_type: data['token-type'],
        expiresIn: data['expires-in'],
    };
}
