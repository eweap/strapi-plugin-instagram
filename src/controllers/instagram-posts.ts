export async function index(ctx: any) {
    const posts = await strapi.plugins.instagram.services[
        'instagram-posts'
    ].getAll();
    ctx.send(posts);
}
