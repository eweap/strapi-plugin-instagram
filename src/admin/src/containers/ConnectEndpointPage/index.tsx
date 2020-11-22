/*
 *
 * ConnectEndpointPage
 *
 */

import React, { memo } from 'react';
import { Header } from '@buffetjs/custom';
import axios from 'axios';
import { useGlobalContext } from 'strapi-helper-plugin';

const ConnectEndpointPage = () => {
    const globalContext = useGlobalContext();
    const pluginName = globalContext.plugins.instagram.name;
    let jwtToken =
        localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
    jwtToken = jwtToken ? JSON.parse(jwtToken) : jwtToken;

    const code = new URLSearchParams(window.location.search).get('code');
    axios
        .post(
            strapi.backendURL + '/instagram/callback',
            { code },
            {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            }
        )
        .then(
            () =>
                (window.location.href =
                    '/admin/plugins/instagram/connect-success'),
            () =>
                (window.location.href =
                    '/admin/plugins/instagram/connect-error')
        );

    return (
        <div>
            <Header
                title={{ label: `${pluginName} - Connection en cours...` }}
            />
        </div>
    );
};

export default memo(ConnectEndpointPage);
