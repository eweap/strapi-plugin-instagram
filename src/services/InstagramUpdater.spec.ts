import axios from 'axios';

import { InstagramGetUserMedias } from '../interfaces/instagram-api';
import InstagramUpdater from './InstagramUpdater';

import * as MockInstagramPluginStore from '../testing/mocks/MockInstagramPluginStore';

describe('InstagramUpdater', () => {
    const pluginStore = {
        get: jest.fn(),
        set: jest.fn(),
    };

    beforeEach(() => {
        jest.spyOn(strapi.log, 'error');
        strapi.plugins.instagram.services = {
            instagrampluginstore: { default: MockInstagramPluginStore },
        };

        jest.spyOn(MockInstagramPluginStore, 'getPluginStore').mockReturnValue(
            pluginStore
        );
    });

    it('should get authorization configuration', async () => {
        await InstagramUpdater.getAuthorizationConfig();

        expect(pluginStore.get).toHaveBeenCalledWith({ key: 'authorization' });
    });

    describe('Feed', () => {
        const longAccessToken = 'LONG_ACCESS_TOKEN';
        const userId = 'USER_ID';

        beforeEach(() => {
            jest.spyOn(
                InstagramUpdater,
                'getAuthorizationConfig'
            ).mockResolvedValue({
                longAccessToken,
                userId,
            } as any);

            jest.spyOn(axios, 'get');
        });

        afterEach(() => {
            (axios.get as jest.Mock).mockReset();
        });

        it('should not fetch feed when IG account is not connected', async () => {
            jest.spyOn(
                InstagramUpdater,
                'getAuthorizationConfig'
            ).mockResolvedValue(null);

            await InstagramUpdater.fetchFeed();

            expect(InstagramUpdater.getAuthorizationConfig).toHaveBeenCalled();
            expect(axios.get).not.toHaveBeenCalled();
        });

        it('should fetch feed', async () => {
            const userMedias: InstagramGetUserMedias = {
                data: [],
                paging: {} as any,
            };
            (axios.get as jest.Mock).mockResolvedValue({ data: userMedias });
            jest.spyOn(
                InstagramUpdater,
                'updateFeed'
            ).mockImplementationOnce(() => Promise.resolve());

            await InstagramUpdater.fetchFeed();

            expect(InstagramUpdater.getAuthorizationConfig).toHaveBeenCalled();
            expect(axios.get).toHaveBeenCalledWith(
                `https://graph.instagram.com/${userId}/media?access_token=${longAccessToken}`
            );
            expect(InstagramUpdater.updateFeed).toHaveBeenCalledWith([]);
        });

        describe('updateFeed()', () => {
            let userMedias: InstagramGetUserMedias;
            let oldPosts: any[];

            beforeEach(() => {
                jest.spyOn(strapi, 'query').mockReturnValueOnce({
                    find: () => oldPosts,
                });
                jest.spyOn(
                    InstagramUpdater,
                    'fetchInstagramMedia'
                ).mockResolvedValue({
                    id: 'FAKE_ID',
                    media_type: 'IMAGE',
                    caption: 'CAPTION',
                    media_url: 'URL',
                    thumbnail_url: 'THUMBNAIL_URL',
                    timestamp: new Date().toISOString(),
                    permalink: 'PERMALINK',
                });

                (axios.get as jest.Mock).mockResolvedValue({ data: oldPosts });
            });

            it('should not change wheb no new posts and no old posts', async () => {
                userMedias = {
                    data: [],
                    paging: {} as any,
                };
                oldPosts = [];

                await InstagramUpdater.updateFeed(userMedias.data);

                expect(
                    InstagramUpdater.getAuthorizationConfig
                ).toHaveBeenCalled();
                expect(strapi.query).toHaveBeenCalledWith(
                    'InstagramPost',
                    'instagram'
                );
                expect(axios.get).not.toHaveBeenCalled();
            });

            it('should add new posts', async () => {
                userMedias = {
                    data: [],
                    paging: {} as any,
                };
                oldPosts = [];

                await InstagramUpdater.updateFeed(userMedias.data);

                expect(
                    InstagramUpdater.getAuthorizationConfig
                ).toHaveBeenCalled();
                expect(strapi.query).toHaveBeenCalledWith(
                    'InstagramPost',
                    'instagram'
                );
                expect(axios.get).not.toHaveBeenCalled();
            });
        });
    });
});
