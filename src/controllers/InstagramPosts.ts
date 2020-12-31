export async function index(ctx: any) {
    const posts = await strapi.plugins.instagram.services.instagramposts.default.getAll();
    ctx.send(posts);
}
