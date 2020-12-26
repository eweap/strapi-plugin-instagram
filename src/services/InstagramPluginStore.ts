export let pluginStore: StrapiPluginStore;

export function getPluginStore(): StrapiPluginStore {
    if (!pluginStore) {
        pluginStore = strapi.store({
            environment: strapi.config.environment,
            type: 'plugin',
            name: 'instagram',
        });
    }

    return pluginStore;
}
