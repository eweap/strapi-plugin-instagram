import axios from 'axios';

import { InstagramAuthorizationData } from '../interfaces/authorization-data.interface';

export async function handleAuthorizationCode(code: string): Promise<boolean> {
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
        console.log(error);
        const errorMessage =
            error?.response?.data?.error_message || error.toString();

        strapi.log.error(
            `❌ Instagram Plugin -> Failed retrieving short access token (${errorMessage})`
        );

        return false;
    }
}

export async function saveAuthorizationData(
    data: InstagramAuthorizationData
): Promise<void> {
    console.log('saving', data);
    await strapi.plugins.instagram.services.InstagramPluginStore.getPluginStore().set(
        {
            key: 'authorization',
            value: data,
        }
    );
}

export async function requestShortAccessToken(
    code: string
): Promise<{ access_token: string; user_id: string }> {
    const {
        url,
        requestData,
    } = await strapi.plugins.instagram.services.InstagramRequestBuilder.getShortAccessTokenUrl(
        code
    );

    try {
        const { data } = await axios.post(url, requestData);

        return data;
    } catch (error) {
        const errorMessage =
            error?.response?.data?.error_message || error.toString();

        strapi.log.error(
            `❌ Instagram Plugin -> Failed retrieving short access token (${errorMessage})`
        );

        throw error;
    }
}

export async function requestLongAccessToken(
    shortAccessToken: string
): Promise<{ access_token: string; token_type: string; expires_in: string }> {
    const url = await strapi.plugins.instagram.services.InstagramRequestBuilder.getLongAccessTokenUrl(
        shortAccessToken
    );

    try {
        const { data } = await axios.get(url);

        return {
            access_token: data.access_token,
            token_type: data.token_type,
            expires_in: data.expires_in,
        };
    } catch (error) {
        const errorMessage =
            error?.response?.data?.error_message || error.toString();

        strapi.log.error(
            `❌ Instagram Plugin -> Failed retrieving long access token (${errorMessage})`
        );

        throw error;
    }
}

export async function refreshLongAccessToken(
    longAccessToken: string
): Promise<{ access_token: string; token_type: string; expires_in: string }> {
    const url = await strapi.plugins.instagram.services.InstagramRequestBuilder.getRefreshLongAccessTokenUrl(
        longAccessToken
    );

    const { data } = await axios.get(url);

    return {
        access_token: data['access-token'],
        token_type: data['token-type'],
        expires_in: data['expires-in'],
    };
}