import { InstagramConfig } from '../config/instagram-api.config';
import * as InstagramRequestBuilder from './InstagramRequestBuilder';

import {
    testFacebookAppClientId,
    testFacebookAppClientSecret,
} from '../testing/config';

describe('InstagramRequestBuilder', () => {
    const redirectUri = 'https://www.example.com/connect/endpoint';

    beforeEach(() => {
        jest.spyOn(InstagramRequestBuilder, 'getRedirectUrl').mockReturnValue(
            redirectUri
        );
    });

    describe('Get instagram url', () => {
        it('return instagram url', () => {
            expect(InstagramRequestBuilder.getInstagramUrl()).toBe(
                InstagramConfig.rootUrl
            );
        });

        it('return instagram url to a specific path', () => {
            const path = '/my-path';
            expect(InstagramRequestBuilder.getInstagramUrl(path)).toBe(
                `${InstagramConfig.rootUrl}${path}`
            );
        });

        it('return instagram url to a specific path with query params', () => {
            const path = '/my-path';
            const queryParams = {
                fii: 'bee',
                foo: 'bar',
            };

            expect(
                InstagramRequestBuilder.getInstagramUrl(path, queryParams)
            ).toBe(`${InstagramConfig.rootUrl}${path}?fii=bee&foo=bar`);
        });

        it('return instagram url with a different root url', () => {
            expect(
                InstagramRequestBuilder.getInstagramUrl(
                    undefined,
                    undefined,
                    InstagramConfig.graphRootUrl
                )
            ).toBe(InstagramConfig.graphRootUrl);
        });
    });

    it('should return authorization pop url', () => {
        const redirectUriEncoded = encodeURIComponent(redirectUri);

        const popUrl = InstagramRequestBuilder.getAuthorizationPopupUrl();

        expect(popUrl).toBe(
            `${InstagramConfig.rootUrl}/oauth/authorize?client_id=${testFacebookAppClientId}&redirect_uri=${redirectUriEncoded}&response_type=code&scope=user_profile%2Cuser_media`
        );
    });

    it('should return short access token url', () => {
        const code = 'FAKE_CODE';
        const redirectUriEncoded = encodeURIComponent(redirectUri);

        const shortAccessTokenUrl = InstagramRequestBuilder.getShortAccessTokenUrl(
            code
        );

        expect(shortAccessTokenUrl).toEqual({
            url: `${InstagramConfig.rootUrl}/oauth/access_token`,
            requestData: `client_id=${testFacebookAppClientId}&client_secret=${testFacebookAppClientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${redirectUriEncoded}`,
        });
    });

    it('should return long access token url', () => {
        const shortAccessToken = 'FAKE_SHORT_ACCESS_TOKEN';

        const shortAccessTokenUrl = InstagramRequestBuilder.getLongAccessTokenUrl(
            shortAccessToken
        );

        expect(shortAccessTokenUrl).toEqual(
            `${InstagramConfig.graphRootUrl}/access_token?access_token=${shortAccessToken}&client_secret=${testFacebookAppClientSecret}&grant_type=ig_exchange_token`
        );
    });

    it('should return long access token url', () => {
        const longAccessToken = 'FAKE_LONG_ACCESS_TOKEN';

        const refreshAccessTokenUrl = InstagramRequestBuilder.getRefreshLongAccessTokenUrl(
            longAccessToken
        );

        expect(refreshAccessTokenUrl).toEqual(
            `${InstagramConfig.graphRootUrl}/access_token?access_token=${longAccessToken}&grant_type=ig_refresh_token`
        );
    });
});
