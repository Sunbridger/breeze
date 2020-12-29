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
    config.middleware = [];

    // add your user config here
    const userConfig = {
    // myAppName: 'egg',
    };

    config.security = {
        csrf: {
            enable: false,
        },
        methodnoallow: {
            enable: false,
        },
    };

    config.sequelize = {
        dialect: 'mysql',
        host: '172.17.40.212',
        port: 3306,
        username: 'root',
        password: 'root',
        define: {
            timestamps: false,
            freezeTableName: true,
            underscored: true,
        },
        timezone: '+08:00',
        database: 'breeze', // 必填
    };

    config.mysql = {
        // 单数据库信息配置
        client: {
            // host
            host: '172.17.40.212',
            // 端口号
            port: '3306',
            // 用户名
            user: 'root',
            // 密码
            password: 'root',
            // 数据库名
            database: 'breeze',
        },
    };

    return {
        ...config,
        ...userConfig,
    };
};
