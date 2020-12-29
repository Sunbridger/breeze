/**
 * 获取seo相关配置
 */

import { Controller } from 'egg';
const URL = require('url').URL;

export default class ConfigurationController extends Controller {
    rule() {
        return {
            controllConfigRule: {
                entry: { type: 'string', required: true, max: 100 },
                moduleName: { type: 'string', required: true, max: 100 },
                whitePath: { type: 'array' },
                ignorePath: { type: 'array' },
                ignoreParams: { type: 'array' },
            },
        };
    }
    /**
     * 从参数中获取配置,并且入库
     */
    async getControllConfig() {
        const { ctx } = this;
        const { breeze } = ctx.request.body;
        let query: any = null;
        try {
            ctx.logger.info(`robben请求参数${JSON.stringify(ctx.request.body)}`);
            query = typeof breeze === 'string' ? JSON.parse(breeze) : breeze;
        } catch (e) {
            ctx.logger.info(`breeze获取参数转换失败${e}`);
            throw new ctx.HttpError.BadRequest('getconfig json转换失败');
        }
        // 支持数据形式多项目爬取
        if (Array.isArray(query)) {
            for (let i = 0; i < query.length; i++) {
                await this.goToCrawler(query[i]);
            }
        } else {
            await this.goToCrawler(query);
        }

    }

    async goToCrawler(query) {
        const { ctx } = this;
        const rule = this.rule().controllConfigRule;
        // 验证
        ctx.validate(rule, query);

        const url = new URL(query.entry);
        query.entry = `${url.origin}/`;
        if (url.pathname !== '/') {
            query.whitePath = query.whitePath.map(v => `${url.pathname}${v}`);
            query.whitePath.unshift(url.pathname);
            query.ignorePath = query.ignorePath.map(v => `${url.pathname}${v}`);
            query.isSubproject = 1;
        } else {
            query.isSubproject = 0;
        }

        // 数组变字符串，方便存数据库
        for (const key in query) {
            if (Object.prototype.hasOwnProperty.call(query, key)) {
                if (typeof query[key] === 'object') {
                    try {
                        query[key] = JSON.stringify(query[key]);
                    } catch (e) {
                        ctx.logger.error(`goToCrawler jsonstringify${e}`);
                    }
                } else if (key !== 'isSubproject') {
                    query[key] = query[key].toString();
                }
            }
        }
        ctx.body = await ctx.service.configuration.getServiceConfig(query);
    }
    // 判断数据库中是否已经存在当前配置
    // async haveConfig() {
    //     const users = await this.ctx.service.configuration.haveConfig();
    //     this.ctx.body = users;
    // }

    // 更新当前数据库
    // async updateConfig() {
    //     const users = await this.ctx.service.configuration.updateConfig();
    //     this.ctx.body = users;
    // }
}
