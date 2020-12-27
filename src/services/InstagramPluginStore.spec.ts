import InstagramPluginStore from './InstagramPluginStore';

describe('InstagramConnect', () => {
    it('should save authorization data', async () => {
        const pluginStore = {
            get: jest.fn(),
            set: jest.fn(),
        };
        jest.spyOn(strapi, 'store').mockReturnValue(pluginStore);

        // Should create the plugin store singleton
        expect(await InstagramPluginStore.getPluginStore()).toBe(pluginStore);
        expect(strapi.store).toHaveBeenCalledWith({
            environment: 'test',
            type: 'plugin',
            name: 'instagram',
        });

        (strapi.store as jest.Mock).mockReset();

        // Should return the singleton already created
        expect(await InstagramPluginStore.getPluginStore()).toBe(pluginStore);
        expect(strapi.store).not.toHaveBeenCalled();
    });
});
