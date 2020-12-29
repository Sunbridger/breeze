
/**
 * 根据entry返回对应html
 */
import { Controller } from 'egg';

export default class RenderController extends Controller {
    rule() {
        return {
            renderConfigRule: {
                url: { type: 'string', required: true },
            },
        };
    }
    /**
     * 从参数中获取附表的信息，并且入库
     */
    async getHtmlContent() {
        const rule = this.rule().renderConfigRule;
        const { ctx } = this;
        ctx.logger.info('新的爬虫请求=============================================');
        ctx.logger.info(JSON.stringify(ctx.headers), 'ctx.headers');
        ctx.logger.info(JSON.stringify(ctx.request), 'ctx.request');
        const host = ctx.get('host');
        const origin = ctx.request.url;
        // origin = origin.split(' ')[1];
        const query = {
            url: `https://${host}${origin}`,
        };
        ctx.logger.info(`用户访问url: ${query.url}`);
        // 验证
        ctx.validate(rule, query);
        if (!origin) {
            throw new ctx.HttpError.BadRequest('无法获取url');
        }
        this.ctx.set('Content-Type', 'text/html');
        this.ctx.body = await ctx.service.render.getHtmlContent(query);
    }
}
