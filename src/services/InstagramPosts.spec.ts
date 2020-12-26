import * as InstagramPosts from './InstagramPosts';

describe('InstagramPosts', () => {
    it('should get authorization configuration', async () => {
        await InstagramPosts.getAuthorizationConfig();
    });

    it('should get all instagram posts', async () => {
        await InstagramPosts.getAll();
    });

    it('should fetch feed', async () => {
        await InstagramPosts.fetchFeed();
    });

    it('should update feed', async () => {
        const data = {};
        await InstagramPosts.updateFeed(data);
    });
});
