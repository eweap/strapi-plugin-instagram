export async function getAuthorizationUrl(ctx: any) {
    const authorizationUrl = await strapi.plugins.instagram.services[
        'instagram-request-builder'
    ].getAuthorizationPopupUrl();

    ctx.send({ authorizationUrl });
}

export async function handleCallback(ctx: any) {
    const { code } = ctx.request.body;

    // No code provided, redirect to error page
    if (!code) {
        ctx.throw(401, 'No code provided');
    }

    // Handle authorzation code
    const success = await strapi.plugins.instagram.services[
        'instagram-connect'
    ].handleAuthorizationCode(code);

    if (success) {
        ctx.send();
    } else {
        ctx.throw(401);
    }
}
