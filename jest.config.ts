import {
    testFacebookAppClientId,
    testFacebookAppClientSecret,
} from './src/testing/config';

export = {
    displayName: 'strapi-plugin-instagram',
    globals: {
        strapi: {
            log: {
                error: () => {},
            },

            config: {
                environment: 'test',
                get: () => {},
            },

            store: () => ({
                get: () => {},
                set: () => {},
            }),

            plugins: {
                instagram: {
                    config: {
                        facebookAppClientId: testFacebookAppClientId,
                        facebookAppClientSecret: testFacebookAppClientSecret,
                    },
                },
            },
        },
    },
};
