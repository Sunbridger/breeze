#!/usr/bin/env node
'use strict';
/**
 * plusman created at 2017-12-12 18:39:58
 *
 * Copyright (c) 2017 Souche.com, all rights
 * reserved
 */

const ENV = process.env.CONFIG_ENV;
const FILE_SUFFIX = process.env.FILE_SUFFIX || ENV;
const APP = process.env.APP;
const CLUSTER = process.env.CLUSTER;
const NAMESPACE = process.env.NAMESPACE;
const fs = require('fs');

const ConfigPorter = require('@souche/config-porter');
const nodeConfigSdk = new ConfigPorter({
  app: 'breeze',
  env: ENV,
  version: 'v2'
});

// 写入环境变量
fs.writeFileSync('config/env', FILE_SUFFIX, {
  encoding: 'utf8',
});

async function __main() {
  const config = await nodeConfigSdk.fetch();
  fs.writeFileSync(
    `config/config.${FILE_SUFFIX}.ts`,
    await creatMain(config));
  console.log(`ENV#${ENV} config file has been generated successfully!`);
}

async function creatMain (config){
    return `/* eslint valid-jsdoc: "off" */
'use strict';
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
/**
* @param {Egg.EggAppInfo} appInfo app info
*/
export default (appInfo: EggAppInfo) => {

    const config: PowerPartial<EggAppConfig> = {};
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1554272085559_6310';

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };
    config.sequelize = ${JSON.stringify(config.sequelize, null, '  ')};
    config.mysql = ${JSON.stringify(config.mysql, null, '  ')};
    config.security = {
        csrf: {
            enable: false
        },
        methodnoallow: {
            enable: false
        }
    };
    return {
        ...config,
        ...userConfig,
    };
};`
      }
__main();
