# Strapi plugin instagram

## Installation

```
$ npm i strapi-plugin-instagram
```

Example
or

```
$ yarn add strapi-plugin-instagram
```

## Configurations

### Base config

`./config/plugins.js`

```js
module.exports = ({ env }) => ({
    instagram: {
        facebookAppClientId: env('INSTAGRAM_APP_CLIENT_ID'),
        facebookAppClientSecret: env('INSTAGRAM_APP_CLIENT_SECRET'),

        // Optionnal - Use `overrideAdminUrl` during development
        // to redirect after instagram login to your local server
        // (take a look at https://ngrok.com/ )
        // ex: 'https://GROK_ID.eu.ngrok.io/admin',
        overrideAdminUrl: null,
    },
});
```

### Cron

After connecting your Instagram account throught the admin, this plugin will fetch your instagram posts with the [Instagram basic display API](https://developers.facebook.com/docs/instagram-basic-display-api)

Add the following cron jobs to trigger associated tasks:

`./config/functions/cron.js`

```js
// At every 30th minute
'*/30 * * * *': () => {
    strapi.plugins.instagram.services.instagramupdater.default.fetchFeed();
},

// At 00:00
'0 0 * * *': () => {
    strapi.plugins.instagram.services.instagramtokenrefresher.default.refreshToken();
},
```

### Others

You will need to create a [Facebook App](https://developers.facebook.com/apps) and provide your informations in the plugin config.

If you need to scrap posts from an Instagram account you don't control, take a look to [strapi-plugin-instagram-feed](https://github.com/YegorShtonda/strapi-plugin-instagram-feed)

--

_I work on this plugin on my spare time, any help is welcome._
