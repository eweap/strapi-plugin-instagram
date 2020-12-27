import axios from 'axios';

import { InstagramAuthorizationData } from '../interfaces/authorization-data.interface';

import InstagramConnect from './InstagramConnect';
import * as MockInstagramPluginStore from '../testing/mocks/MockInstagramPluginStore';

describe('InstagramConnect', () => {
    const userId = 'USER_ID';
    const authorizationCode = 'FAKE_AUTHORIZATION_CODE';
    const shortAccessToken = 'SHORT_ACCESS_TOKEN';
    const longAccessToken = 'LONG_ACCESS_TOKEN';
    const tokenType = 'TOKEN_TYPE';
    const expiresIn = new Date().toISOString();

    beforeEach(() => {
        jest.spyOn(strapi.log, 'error');
        strapi.plugins.instagram.services = {
            InstagramPluginStore: MockInstagramPluginStore,
        };
    });

    describe('Handle authorization code', () => {
        it('should return true on handle authorization code success', async () => {
            jest.spyOn(
                InstagramConnect,
                'requestShortAccessToken'
            ).mockResolvedValueOnce({
                access_token: shortAccessToken,
                user_id: userId,
            });
            jest.spyOn(
                InstagramConnect,
                'requestLongAccessToken'
            ).mockResolvedValueOnce({
                access_token: longAccessToken,
                token_type: tokenType,
                expires_in: expiresIn,
            });
            jest.spyOn(
                InstagramConnect,
                'saveAuthorizationData'
            ).mockResolvedValueOnce(undefined);

            const result = await InstagramConnect.handleAuthorizationCode(
                authorizationCode
            );

            expect(result).toBe(true);
            expect(
                InstagramConnect.requestShortAccessToken
            ).toHaveBeenCalledWith(authorizationCode);
            expect(
                InstagramConnect.requestLongAccessToken
            ).toHaveBeenCalledWith(shortAccessToken);
            expect(InstagramConnect.saveAuthorizationData).toHaveBeenCalledWith(
                {
                    user_id: userId,
                    code: authorizationCode,
                    long_access_token: longAccessToken,
                    token_type: tokenType,
                    expires_in: expiresIn,
                }
            );
        });

        it('should return false on handle authorization code error', async () => {
            jest.spyOn(
                InstagramConnect,
                'requestShortAccessToken'
            ).mockRejectedValueOnce(new Error());
            jest.spyOn(strapi.log, 'error').mockImplementationOnce(() => {});

            const result = await InstagramConnect.handleAuthorizationCode(
                authorizationCode
            );

            expect(result).toBe(false);
            expect(strapi.log.error).toHaveBeenCalledWith(expect.any(String));
        });
    });

    describe('Handle authorization data', () => {
        it('should save authorization data', async () => {
            const pluginStore = {
                set: jest.fn(),
            };
            jest.spyOn(
                strapi.plugins.instagram.services.InstagramPluginStore,
                'getPluginStore'
            ).mockReturnValue(pluginStore);
            const data: InstagramAuthorizationData = {
                user_id: userId,
                code: authorizationCode,
                expires_in: expiresIn,
                long_access_token: longAccessToken,
                token_type: tokenType,
            };

            await InstagramConnect.saveAuthorizationData(data);

            expect(
                strapi.plugins.instagram.services.InstagramPluginStore
                    .getPluginStore
            ).toHaveBeenCalled();
            expect(pluginStore.set).toHaveBeenCalledWith({
                key: 'authorization',
                value: data,
            });
        });
    });

    describe('Access token', () => {
        const url = 'httpx://www.example.com';

        it('should request a short access token', async () => {
            const requestData = '';
            strapi.plugins.instagram.services = {
                InstagramRequestBuilder: {
                    getShortAccessTokenUrl: jest
                        .fn()
                        .mockResolvedValue({ url, requestData }),
                },
            };
            const code = 'FAKE_CODE';
            const data = { access_token: shortAccessToken, user_id: userId };

            jest.spyOn(axios, 'post').mockResolvedValueOnce({ data });

            expect(
                await InstagramConnect.requestShortAccessToken(code)
            ).toEqual(data);
            expect(axios.post).toHaveBeenCalledWith(url, requestData);
        });

        it('should request a long access token', async () => {
            strapi.plugins.instagram.services = {
                InstagramRequestBuilder: {
                    getLongAccessTokenUrl: jest.fn().mockResolvedValue(url),
                },
            };

            const responseData = {
                access_token: longAccessToken,
                token_type: tokenType,
                expires_in: expiresIn,
            };
            jest.spyOn(axios, 'get').mockResolvedValueOnce({
                data: responseData,
            });

            expect(
                await InstagramConnect.requestLongAccessToken(shortAccessToken)
            ).toEqual({
                access_token: longAccessToken,
                token_type: tokenType,
                expires_in: expiresIn,
            });
            expect(axios.get).toHaveBeenCalledWith(url);
        });

        it('should refresh a long access token', async () => {
            strapi.plugins.instagram.services = {
                InstagramRequestBuilder: {
                    getRefreshLongAccessTokenUrl: jest
                        .fn()
                        .mockResolvedValue(url),
                },
            };

            const responseData = {
                ['access-token']: longAccessToken,
                ['token-type']: tokenType,
                ['expires-in']: expiresIn,
            };
            jest.spyOn(axios, 'get').mockResolvedValueOnce({
                data: responseData,
            });

            expect(
                await InstagramConnect.refreshLongAccessToken(shortAccessToken)
            ).toEqual({
                access_token: longAccessToken,
                token_type: tokenType,
                expires_in: expiresIn,
            });
            expect(axios.get).toHaveBeenCalledWith(url);
        });
    });
});
