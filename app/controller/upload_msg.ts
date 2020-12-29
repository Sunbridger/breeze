import { Controller } from 'egg';

export default class UploadMsgController extends Controller {
    async msgCollect() {
        const { ctx } = this;
        ctx.body = await ctx.service.uploadMsg.msgCollect(ctx.request.body);
    }

    async updateSeoInfo() {
        const { ctx } = this;
        const allProjectInfo =JSON.parse(ctx.request.body.projectDataArr || '[]');
        ctx.body = await ctx.service.updateDate.updateSeoInfo(allProjectInfo);
    }
}
