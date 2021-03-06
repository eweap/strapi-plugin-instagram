declare namespace strapi {
    const backendURL: string;

    const config: any;
    const plugins: any;
    const services: any;
    const utils: any;
    const log: any;
    const store: any;
    const query: any;

    const lockApp: () => undefined;
}

interface StrapiPluginStore {
    set: () => Promise<any>;
    get: () => Promise<any>;
}
