export async function index(ctx: any) {
    const posts = await strapi.plugins.instagram.services.InstagramPosts.getAll();
    ctx.send(posts);
}
