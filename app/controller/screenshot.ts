
import { Controller } from 'egg';

export default class Screenshot extends Controller {
    static rule() {
        return {
            creatAppRule: {
                url: { type: 'string', required: true },
                screenWidth: { type: 'string', required: true },
            },
        };
    }

    async getScreenshotImage() {
        const { ctx } = this;
        ctx.logger.info(ctx.request.query, 'ctx.request.query');
        const rule = Screenshot.rule().creatAppRule;
        ctx.validate(rule, ctx.request.query);
        const data: any = await ctx.service.screenshot.doScreenshotTask(ctx.request.query);
        ctx.body = {
            success: true,
            code: 200,
            msg: 'success',
            data,
        };
    }
}
