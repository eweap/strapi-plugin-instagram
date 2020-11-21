/*
 *
 * ConnectErrorPage
 *
 */

import React, { memo } from 'react';
import { Header } from '@buffetjs/custom';
import { useGlobalContext } from 'strapi-helper-plugin';

const ConnectErrorPage = () => {
    const globalContext = useGlobalContext();
    const pluginName = globalContext.plugins.instagram.name;

    return (
        <div>
            <Header title={{ label: `${pluginName} - Échec de connexion` }} />
        </div>
    );
};

export default memo(ConnectErrorPage);
