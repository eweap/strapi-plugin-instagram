import { InstagramAuthorizationData } from '../interfaces/authorization-data.interface';

const getAuthorizationConfig = async function getAuthorizationConfig(): Promise<InstagramAuthorizationData> {
    return await strapi.plugins.instagram.services.instagrampluginstore.default
        .getPluginStore()
        .get({
            key: 'authorization',
        });
};

const isRefreshNeeded = function isRefreshNeeded(expiresAt: string): boolean {
    // Instagram token are valid 60 days
    // we will refresh the token 1 week before expiration

    const nextWeek = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    const willExpiresNextWeek = new Date(expiresAt) < nextWeek;

    return willExpiresNextWeek;
};

// A cron task must trigger this refresh verification
const refreshToken = async function refreshToken(): Promise<void> {
    const {
        userId,
        expiresAt,
        longAccessToken,
    } = await InstagramTokenRefresher.getAuthorizationConfig();

    if (InstagramTokenRefresher.isRefreshNeeded(expiresAt)) {
        try {
            const data = await strapi.plugins.instagram.services.instagramconnect.default.refreshLongAccessToken(
                longAccessToken
            );

            const expiresAt = strapi.plugins.instagram.services.instagramconnect.default.calculateExpiresAt(
                data.expires_in
            );

            const refreshedAuthorizationData: InstagramAuthorizationData = {
                userId,
                longAccessToken: data.access_token,
                tokenType: data.token_type,
                expiresAt,
            };

            strapi.plugins.instagram.services.instagramconnect.default.saveAuthorizationData(
                refreshedAuthorizationData
            );
        } catch (error) {
            console.log(error);
            const errorMessage =
                error?.response?.data?.error?.message || error.toString();

            strapi.log.error(
                `❌ Instagram Plugin -> Failed to refresh access token (${errorMessage})`
            );
        }
    }
};

const InstagramTokenRefresher = {
    getAuthorizationConfig,
    isRefreshNeeded,
    refreshToken,
};

export default InstagramTokenRefresher;
