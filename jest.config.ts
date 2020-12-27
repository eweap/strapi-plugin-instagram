import {
    testFacebookAppClientId,
    testFacebookAppClientSecret,
} from './src/testing/config';

export = {
    displayName: 'strapi-plugin-instagram',
    globals: {
        strapi: {
            log: {
                info: () => {},
                error: () => {},
            },

            config: {
                environment: 'test',
                get: () => {},
            },

            plugins: {
                instagram: {
                    config: {
                        facebookAppClientId: testFacebookAppClientId,
                        facebookAppClientSecret: testFacebookAppClientSecret,
                    },
                },
            },

            query: () => ({ find: () => {} }),

            store: () => ({
                get: () => {},
                set: () => {},
            }),
        },
    },
};
