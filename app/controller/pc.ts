
import { Controller } from 'egg';

export default class Api extends Controller {
    async getOverviewData() {
        const { ctx } = this;
        ctx.body = await ctx.service.pc.getOverviewData();
    }
    async projectDetail() {
        const { ctx } = this;
        ctx.body = await ctx.service.pc.projectDetail(ctx.request.query);
    }
    async getVisitNum() {
        const { ctx } = this;
        ctx.body = await ctx.service.pc.getVisitNum(ctx.request.query);
    }
    async getTopFiveSpider() {
        const { ctx } = this;
        ctx.body = await ctx.service.pc.getTopFiveSpider(ctx.request.query);
    }
    async getTopTenPage() {
        const { ctx } = this;
        ctx.body = await ctx.service.pc.getTopTenPage(ctx.request.query);
    }
}
