

import { Service } from 'egg';
const fs = require('mz/fs');
const URL = require('url').URL;

export default class RenderService extends Service {
    formateUa(ua) {
        // 白名单参考自 https://ie.icoa.cn/bot
        const whiteSpider = ['360Spider', 'Googlebot', 'bingbot', 'Baiduspider', 'Sogou', 'YisouSpider', 'serpstatbot', 'Bytespider', 'AhrefsBot', 'YandexBot', 'dianjing_ad_spider', 'DingTalkBot'];
        let result = '';
        whiteSpider.some(spidername => {
            let flag = ua.toLocaleLowerCase().match(spidername.toLocaleLowerCase());
            if (flag) {
                result = spidername;
            } else {
                result = ua.split('compatible; ')[1] ? ua.split('compatible; ')[1].split('; ')[0] : ua;
            }
            return flag;
        });
        return result;
    }
    async handleCrawlerUrl(url, ignoreParams) {
        try {
            ignoreParams = JSON.parse(ignoreParams) || [];
        } catch (e) {
            ignoreParams = [];
        }
        const urlObj = new URL(url);
        const base = `${urlObj.origin}${urlObj.pathname}`;
        let origin = `${base}?`;
        const query = urlObj.search;
        if (!query) {
            return base;
        }
        const qs = query.slice(1).split('&');
        const queryObj = {};
        qs.forEach(value => {
            const v = value.split('=');
            queryObj[v[0]] = v[1] || '';
        });
        for (let i = 0; i < ignoreParams.length; i++) {
            const ignoreParam = ignoreParams[i];
            if (typeof queryObj[ignoreParam] !== 'undefined') {
                delete queryObj[ignoreParam];
            }
        }
        Object.keys(queryObj).forEach(v => {
            origin += `${v}=${queryObj[v]}&`;
        });
        origin = origin.slice(0, -1);
        return origin;
    }
    async getHtmlContent(query) {
        const { ctx, config } = this;
        const { url } = query;
        let fileName = '';
        let results: any = '';
        let notFoundFileName = '';
        let record: any = {};
        let recordNotFound: any = {};
        const host = `${new URL(url).origin}/`;
        const notFoundUrl = `${host}404.html`;
        const project: any = await ctx.model.Init.findOne({
            where: { entry: host },
        });
        if (!project) {
            throw new ctx.HttpError.BadRequest('未找到对应项目');
        }
        const dealUrl = await this.handleCrawlerUrl(url, project.ignoreParams);
        if (project && project.route_table_name) {
            record = await this.app.mysql.get(project.route_table_name, { route_name: dealUrl }) || {};
            recordNotFound = await this.app.mysql.get(project.route_table_name, { route_name: notFoundUrl }) || {};
        }
        fileName = record.file_name || '';
        notFoundFileName = recordNotFound.file_name || '';

        if (project.route_table_name && fileName) {
            try {
                results = await fs.readFileSync(`${config.detailPath}/${project.route_table_name}/${fileName}.html`);
            } catch (e) {
                ctx.logger.info(`未找到对应目录文件${e}`);
            }
            ctx.logger.info(`插入到实时表中开始**************************************************************************************************************>`);
            await ctx.model.Today.create({
                visit_num: 1,
                son_router: dealUrl,
                belong_project: project.moduleName,
                ua: this.formateUa(ctx.headers['user-agent'])
            });
            ctx.logger.info(`**************************************************************************************************************>插入到实时表结束`);
        }
        if (!results && project.route_table_name && notFoundFileName) {
            try {
                results = await fs.readFileSync(`${config.detailPath}/${project.route_table_name}/${notFoundFileName}.html`);
            } catch (e) {
                throw new ctx.HttpError.InternalServerError('未能返回对应的文件');
            }
        }
        if (!record.id) {
            let notFoundPath: any = [];
            try {
                notFoundPath = JSON.parse(project.notFoundPath || '[]');
            } catch (e) {
                notFoundPath = [];
                ctx.logger.error(`notFoundPath转换失败: ${e}`);
            }
            const stringLen = 490;
            notFoundPath.push(encodeURIComponent(dealUrl));
            notFoundPath = Array.from(new Set(notFoundPath));
            notFoundPath = JSON.stringify(notFoundPath);
            (notFoundPath.length < stringLen) && await project.update({
                notFoundPath
            });
        }
        return results;
    }
}
