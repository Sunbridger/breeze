/* eslint valid-jsdoc: "off" */


import { EggAppInfo, EggAppConfig, PowerPartial } from 'egg';
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
export default (appInfo: EggAppInfo) => {

    const config: PowerPartial<EggAppConfig> = {};
    /**
        * built-in config
        * @type {Egg.EggAppConfig}
        **/

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1554272085559_6310';

    // add your middleware config here
    config.middleware = [ 'robben' ];

    config.security = {
        csrf: {
            enable: false,
        },
        methodnoallow: {
            enable: false,
        },
        domainWhiteList: [ '*' ],
    };
    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };

    return {
        ...config,
        ...userConfig,
    };
};
