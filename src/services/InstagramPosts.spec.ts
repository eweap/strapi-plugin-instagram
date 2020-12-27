import InstagramPosts from './InstagramPosts';

describe('InstagramPosts', () => {
    let posts;

    beforeEach(() => {
        posts = [];

        jest.spyOn(strapi, 'query').mockReturnValueOnce({
            find: () => posts,
        });
    });

    describe('Feed', () => {
        it('should get all instagram posts', async () => {
            const result = await InstagramPosts.getAll();

            expect(result).toBe(posts);

            expect(strapi.query).toHaveBeenCalledWith(
                'InstagramPost',
                'instagram'
            );
        });
    });
});
