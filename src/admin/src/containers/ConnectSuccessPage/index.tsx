/*
 *
 * ConnectSuccessPage
 *
 */

import React, { memo } from 'react';
import { Header } from '@buffetjs/custom';
import { useGlobalContext } from 'strapi-helper-plugin';

const ConnectSuccessPage = () => {
    const globalContext = useGlobalContext();
    const pluginName = globalContext.plugins.instagram.name;

    return (
        <div>
            <Header title={{ label: `${pluginName} - Connection réussie` }} />
        </div>
    );
};

export default memo(ConnectSuccessPage);
