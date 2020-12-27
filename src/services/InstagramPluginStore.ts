export let pluginStore: StrapiPluginStore;

const getPluginStore = function getPluginStore(): StrapiPluginStore {
    if (!pluginStore) {
        pluginStore = strapi.store({
            environment: strapi.config.environment,
            type: 'plugin',
            name: 'instagram',
        });
    }

    return pluginStore;
};

const module = {
    getPluginStore,
};

export default module;
