import axios from 'axios';

export async function getAuthorizationConfig() {
    return await strapi.plugins.instagram.services['instagram-plugin-store']
        .getPluginStore()
        .get({
            key: 'authorization',
        });
}

export async function getAll() {
    throw new Error('InstagramPosts.getAll() not implemented');
}

export async function fetchFeed() {
    const { accessToken, userId } = await this.getAuthorizationConfig();

    try {
        const { data } = await axios.get(
            `https://graph.instagram.com/${userId}/media?access_token=${accessToken}`
        );

        this.updateFeed(data);
    } catch (error) {
        const errorMessage =
            error?.response?.data?.error?.message || error.toString();

        strapi.log.error(
            `❌ Instagram Plugin -> Failed fetching feed (${errorMessage})`
        );
    }
}

export async function updateFeed(data: any) {
    const { accessToken } = await this.getAuthorizationConfig();

    const mediaIds = data.data.map((media: any) => media.id);

    const oldPosts = await strapi.query('instagram-post', 'instagram').find();
    const oldPostExternalIds = oldPosts.map((p: any) => p.externalId);

    const newMediaIds = mediaIds.filter(
        (mediaId: string) => !oldPostExternalIds.includes(mediaId)
    );

    const fields = ['id', 'media_type', 'media_url', 'thumbnail_url'];
    const newMediasPromise = newMediaIds.map(async (newMediaId: string) => {
        let newMedia = null;
        try {
            const { data } = await axios.get(
                `https://graph.instagram.com/${newMediaId}?fields=${fields.join(
                    ','
                )}&access_token=${accessToken}`
            );

            newMedia = data.data;
        } catch (error) {
            strapi.log.error(
                `❌ Instagram Plugin -> Failed fetching feed (${
                    error.message || error.toString()
                })`
            );

            throw error;
        }

        return newMedia;
    });

    const newMedias = await Promise.all(newMediasPromise);

    // newMedias.map(media => {
    //     console.log('Saving', media);
    //     strapi.query('instagram-post', 'instagram').create({
    //         externalId: media.id,
    //         mediaType: media.media_type,
    //         mediaUrl: media.media_url,
    //         thumbnailUrl: media.thumbnail_url,
    //     });
    // });

    strapi.log.info(
        `✅ Instagram Plugin -> Feed updated with ${newMedias.length} new medias !`
    );
}
