import InstagramTokenRefresher from './InstagramTokenRefresher';
import InstagramConnect from './InstagramConnect';

import * as MockInstagramPluginStore from '../testing/mocks/MockInstagramPluginStore';

describe('InstagramTokenRefresher', () => {
    beforeEach(() => {
        jest.spyOn(strapi.log, 'error');

        strapi.plugins.instagram.services = {
            instagramconnect: { default: InstagramConnect },
            instagramconnect: { default: InstagramConnect },
            instagrampluginstore: { default: MockInstagramPluginStore },
        };
    });

    describe('isRefreshNeeded', () => {
        it('should return true when refresh is needed', () => {
            const tomorrow = new Date(
                Date.now() + 1000 * 60 * 60 * 24
            ).toISOString();

            const result = InstagramTokenRefresher.isRefreshNeeded(tomorrow);

            expect(result).toBe(true);
        });

        it('should return false when refresh is not needed', () => {
            const nextMonth = new Date(
                Date.now() + 1000 * 60 * 60 * 24 * 31
            ).toISOString();

            const result = InstagramTokenRefresher.isRefreshNeeded(nextMonth);

            expect(result).toBe(false);
        });
    });

    describe('refreshToken', () => {
        const userId = 'SUER_ID';
        const longAccessToken = 'LONG_ACCESS_TOKEN';
        const newLongAccessToken = 'NEW_LONG_ACCESS_TOKEN';
        const tokenType = 'bearer';
        const expiresAt = new Date().toISOString();
        const newExpiresAt = new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 60 // In 2 months
        ).toISOString();

        beforeEach(() => {
            jest.spyOn(
                InstagramTokenRefresher,
                'getAuthorizationConfig'
            ).mockResolvedValue({
                userId,
                expiresAt,
                longAccessToken,
            } as any);

            jest.spyOn(
                InstagramConnect,
                'refreshLongAccessToken'
            ).mockResolvedValueOnce({
                access_token: newLongAccessToken,
                token_type: tokenType,
                expires_in: 60 * 60 * 24 * 60, // 2 months in seconds
            } as any);
            jest.spyOn(
                InstagramConnect,
                'saveAuthorizationData'
            ).mockResolvedValueOnce(null);
            jest.spyOn(InstagramConnect, 'calculateExpiresAt').mockReturnValue(
                newExpiresAt
            );
        });

        afterEach(() => {
            (InstagramConnect.refreshLongAccessToken as jest.Mock).mockReset();
            (InstagramConnect.saveAuthorizationData as jest.Mock).mockReset();
            (InstagramConnect.calculateExpiresAt as jest.Mock).mockReset();
        });

        it('should not refresh token when IG account is not connected', async () => {
            jest.spyOn(
                InstagramTokenRefresher,
                'getAuthorizationConfig'
            ).mockResolvedValueOnce(null);

            await InstagramTokenRefresher.refreshToken();

            expect(
                InstagramConnect.saveAuthorizationData
            ).not.toHaveBeenCalled();
        });

        it('should refresh token when needed and save data to plugin store', async () => {
            jest.spyOn(
                InstagramTokenRefresher,
                'isRefreshNeeded'
            ).mockReturnValue(true);

            await InstagramTokenRefresher.refreshToken();

            expect(
                InstagramTokenRefresher.isRefreshNeeded
            ).toHaveBeenCalledWith(expiresAt);
            expect(InstagramConnect.saveAuthorizationData).toHaveBeenCalledWith(
                {
                    userId,
                    longAccessToken: newLongAccessToken,
                    tokenType,
                    expiresAt: newExpiresAt,
                }
            );
        });

        it('should not refresh token when not needed', async () => {
            jest.spyOn(
                InstagramTokenRefresher,
                'isRefreshNeeded'
            ).mockReturnValue(false);

            await InstagramTokenRefresher.refreshToken();

            expect(
                InstagramConnect.saveAuthorizationData
            ).not.toHaveBeenCalled();
        });
    });
});
