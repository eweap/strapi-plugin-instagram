import axios from 'axios';

import { InstagramAuthorizationData } from '../interfaces/authorization-data.interface';

const handleAuthorizationCode = async function handleAuthorizationCode(
    code: string
): Promise<boolean> {
    try {
        const {
            access_token: short_access_token,
            user_id,
        } = await InstagramConnect.requestShortAccessToken(code);
        const {
            access_token: long_access_token,
            token_type,
            expires_in, // Number of seconds left before token expiration
        } = await InstagramConnect.requestLongAccessToken(short_access_token);

        // Calculate when the token will expires
        const expiresAt = InstagramConnect.calculateExpiresAt(expires_in);

        await InstagramConnect.saveAuthorizationData({
            userId: user_id,
            longAccessToken: long_access_token,
            tokenType: token_type,
            expiresAt,
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
    await strapi.plugins.instagram.services.instagrampluginstore.default
        .getPluginStore()
        .set({
            key: 'authorization',
            value: data,
        });
};

const requestShortAccessToken = async function requestShortAccessToken(
    code: string
): Promise<{ access_token: string; user_id: string }> {
    const {
        url,
        requestData,
    } = await strapi.plugins.instagram.services.instagramrequestbuilder.default.getShortAccessTokenUrl(
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
): Promise<{ access_token: string; token_type: string; expires_in: number }> {
    const url = await strapi.plugins.instagram.services.instagramrequestbuilder.default.getLongAccessTokenUrl(
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
    const url = await strapi.plugins.instagram.services.instagramrequestbuilder.default.getRefreshLongAccessTokenUrl(
        longAccessToken
    );

    const { data } = await axios.get(url);

    return {
        access_token: data.access_token,
        token_type: data.token_type,
        expires_in: data.expires_in,
    };
};

const calculateExpiresAt = function calculateExpiresAt(
    expires_in: number
): string {
    return new Date(
        // Convert to ms
        Date.now() + expires_in * 1000
    ).toISOString();
};

const InstagramConnect = {
    handleAuthorizationCode,
    saveAuthorizationData,
    requestShortAccessToken,
    requestLongAccessToken,
    refreshLongAccessToken,
    calculateExpiresAt,
};

export default InstagramConnect;
