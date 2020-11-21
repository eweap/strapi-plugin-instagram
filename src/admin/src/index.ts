import * as pluginPkg from '../../package.json';
import pluginId from './pluginId';
import App from './containers/App';
import Initializer from './containers/Initializer';
import lifecycles from './lifecycles';
import trads from './translations';

export default (strapi: any) => {
    const { description, icon, name } = pluginPkg.strapi;

    const plugin = {
        blockerComponent: null,
        blockerComponentProps: {},
        description,
        id: pluginId,
        initializer: Initializer,
        injectedComponents: [],
        isReady: true,
        isRequired: pluginPkg.strapi.required || false,
        mainComponent: App,
        menu: {
            pluginsSectionLinks: [
                {
                    destination: `/plugins/${pluginId}`,
                    icon,
                    label: {
                        id: `${pluginId}.plugin.name`,
                        defaultMessage: name,
                    },
                    name,
                    permissions: [
                        // Uncomment to set the permissions of the plugin here
                        // {
                        //   action: '', // the action name should be plugins::plugin-name.actionType
                        //   subject: null,
                        // },
                    ],
                },
            ],
        },
        name,
        preventComponentRendering: false,
        trads,

        icon,
        layout: null,
        lifecycles,
    };

    return strapi.registerPlugin(plugin);
};
