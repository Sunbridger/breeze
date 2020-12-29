/* eslint valid-jsdoc: "off" */


import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import Utils from '../app/lib/utils';
const ciBaseUrl: string = 'http://ci.dasouche-inc.net';
const getCiPath = Utils.joinPath(ciBaseUrl);
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */

//  appInfo 获取当前ua的信息
export default (appInfo: EggAppInfo) => {
    const config: PowerPartial<EggAppConfig> = {};
    /**
 * built-in config
 * @type {Egg.EggAppConfig}
 */
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1554272085559_6310';
    // add your middleware config here
    config.middleware = [ 'robben' ];
    // robben自己的接口验证
    config.apiResponse = {
        match: '/api',
    };

    config.cors = {
        origin: '*',
        allowMethods: 'GET,POST,PUT,DELETE,HEAD,PATCH,OPTIONS',
        credentials: true,
    };

    config.CiApi = {
        buildProject: getCiPath('/job/breeze-prerender/buildWithParameters'),
        getBuildInfo: (build_id: string) => (
            getCiPath(`/job/breeze-prerender/${build_id}/api/json`)
        ),
    };

    config.Const = {
        CI_API_TOKEN: '3jdu2i1jdi9tiyjkglvj',
    };

    config.multipart = {
        fileSize: '5000mb',
    };

    config.sequelize = {
        dialect: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: 'czy666666',
        database: 'breeze-default',
    };

    config.mysql = {
        // 单数据库信息配置
        client: {
            // host
            host: '127.0.0.1',
            // 端口号
            port: 3306,
            // 用户名
            user: 'root',
            // 密码
            password: 'czy666666',
            // 数据库名
            database: 'breeze-default',
        },
    };
    // add your user config here
    const userConfig = {
        dirPath: `${appInfo.baseDir}/download`,
        zipPath: `${appInfo.baseDir}/download/zip`,
        zipCachePath: `${appInfo.baseDir}/download/zipCache`,
        detailPath: `${appInfo.baseDir}/download/detail`,
        detailCachePath: `${appInfo.baseDir}/download/detailCache`,
    };

    return {
        ...config,
        ...userConfig,
    };
};
