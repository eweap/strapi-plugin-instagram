import axios from 'axios';

import { InstagramAuthorizationData } from '../interfaces/authorization-data.interface';

const handleAuthorizationCode = async function handleAuthorizationCode(
    code: string
): Promise<boolean> {
    try {
        const {
            access_token: short_access_token,
            user_id,
        } = await module.requestShortAccessToken(code);
        const {
            access_token: long_access_token,
            token_type,
            expires_in,
        } = await module.requestLongAccessToken(short_access_token);

        await module.saveAuthorizationData({
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
};

const saveAuthorizationData = async function saveAuthorizationData(
    data: InstagramAuthorizationData
): Promise<void> {
    await strapi.plugins.instagram.services.InstagramPluginStore.getPluginStore().set(
        {
            key: 'authorization',
            value: data,
        }
    );
};

const requestShortAccessToken = async function requestShortAccessToken(
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
};

const requestLongAccessToken = async function requestLongAccessToken(
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
};

const refreshLongAccessToken = async function refreshLongAccessToken(
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
};

const module = {
    handleAuthorizationCode,
    saveAuthorizationData,
    requestShortAccessToken,
    requestLongAccessToken,
    refreshLongAccessToken,
};

export default module;
