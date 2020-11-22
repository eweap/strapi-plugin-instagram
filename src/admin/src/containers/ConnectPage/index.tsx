/*
 *
 * ConnectPage
 *
 */

import React, { memo } from 'react';
import { Button } from '@buffetjs/core';
import { Header } from '@buffetjs/custom';
import axios from 'axios';
import { useGlobalContext } from 'strapi-helper-plugin';

const ConnectPage = () => {
    const globalContext = useGlobalContext();
    const pluginName = globalContext.plugins.instagram.name;
    let jwtToken =
        localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
    jwtToken = jwtToken ? JSON.parse(jwtToken) : jwtToken;

    async function connect() {
        const { data } = await axios.get(
            strapi.backendURL + '/instagram/connect',
            {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            }
        );

        window.location.href = data.authorizationUrl;
    }

    return (
        <div>
            <Header title={{ label: `${pluginName} - Connecter son compte` }} />
            <Button type="button" label="Se connecter" onClick={connect} />
        </div>
    );
};

export default memo(ConnectPage);
