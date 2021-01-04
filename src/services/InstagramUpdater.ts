import axios from 'axios';
import { InstagramAuthorizationData } from '../interfaces/authorization-data.interface';
import {
    InstagramGetMedia,
    InstagramGetUserMedias,
} from '../interfaces/instagram-api/';

const getAuthorizationConfig = async function getAuthorizationConfig(): Promise<InstagramAuthorizationData | null> {
    return await strapi.plugins.instagram.services.instagrampluginstore.default
        .getPluginStore()
        .get({
            key: 'authorization',
        });
};

const fetchFeed = async function fetchFeed(): Promise<void> {
    const authorizationConfig = await InstagramUpdater.getAuthorizationConfig();

    if (!authorizationConfig?.userId || !authorizationConfig?.longAccessToken) {
        strapi.log.info(
            `📰 Instagram Plugin -> No need to fetch feed, user not connected`
        );
        return;
    }

    const { longAccessToken, userId } = authorizationConfig;

    try {
        const { data }: { data: InstagramGetUserMedias } = await axios.get(
            `https://graph.instagram.com/${userId}/media?access_token=${longAccessToken}`
        );

        const mediaIds = data.data.map((media: any) => media.id);

        // Update feed with the last data fetched
        InstagramUpdater.updateFeed(mediaIds);
    } catch (error) {
        console.log(error);
        const errorMessage =
            error?.response?.data?.error?.message || error.toString();

        strapi.log.error(
            `❌ Instagram Plugin -> 📰 Failed fetching feed (${errorMessage})`
        );
    }
};

const fetchInstagramMedia = async function fetchInstagramMedia(
    mediaId: string
): Promise<InstagramGetMedia> {
    const authorizationConfig = await InstagramUpdater.getAuthorizationConfig();

    if (!authorizationConfig?.longAccessToken) {
        throw new Error(
            'No long access token available to fetch instagram media'
        );
    }

    const fields = [
        'id',
        'media_type',
        'media_url',
        'thumbnail_url',
        'caption',
        'permalink',
        'timestamp',
    ];

    try {
        const { data }: { data: InstagramGetMedia } = await axios.get(
            `https://graph.instagram.com/${mediaId}?fields=${fields.join(
                ','
            )}&access_token=${authorizationConfig.longAccessToken}`
        );

        return data;
    } catch (error) {
        strapi.log.error(
            `❌ Instagram Plugin -> 📰 Failed fetching media ${mediaId} (${
                error.message || error.toString()
            })`
        );

        throw error;
    }
};

const updateFeed = async function updateFeed(mediaIds: string[]) {
    // Get old posts
    const oldPosts: string[] = await strapi
        .query('InstagramPost', 'instagram')
        .find();
    const oldPostExternalIds = oldPosts.map((p: any) => p.externalId);

    // Filter already saved posts
    const newMediaIds: string[] = mediaIds.filter(
        (mediaId: string) => !oldPostExternalIds.includes(mediaId)
    );

    // Fetch each media infos (needed ?)
    const newMediasPromise = newMediaIds.map(async (newMediaId: string) => {
        return await InstagramUpdater.fetchInstagramMedia(newMediaId);
    });

    // Wait all requests to finish
    const newMedias = await Promise.all(newMediasPromise);

    // Save new instagram post one by one
    newMedias.map(media => {
        strapi.query('InstagramPost', 'instagram').create({
            externalId: media.id,
            mediaType: media.media_type,
            mediaUrl: media.media_url,
            thumbnailUrl: media.thumbnail_url,
            caption: media.caption,
            permalink: media.permalink,
        });
    });

    strapi.log.info(
        `✅ Instagram Plugin -> 📰 Feed updated with ${newMedias.length} new medias !`
    );
};

const InstagramUpdater = {
    getAuthorizationConfig,
    fetchFeed,
    fetchInstagramMedia,
    updateFeed,
};

export default InstagramUpdater;
