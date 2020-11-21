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
        ctx.response.redirect('/admin/plugins/instagram/connect-error');
    }

    // Handle authorzation code
    const success = await strapi.plugins.instagram.services[
        'instagram-connect'
    ].handleAuthorizationCode(code);

    if (success) {
        ctx.response.redirect('/admin/plugins/instagram/connect-success');
    } else {
        ctx.response.redirect('/admin/plugins/instagram/connect-error');
    }
}
