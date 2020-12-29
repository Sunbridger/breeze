import { Subscription } from 'egg';
const moment = require('moment');

class TimerCrawl extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            cron: '0 20 1 */7 * *', // 间隔: 每隔一周凌晨4点 0 0 4 */7 * *
            type: 'all', // 指定所有的 worker 都需要执行
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        const { ctx } = this;
        const result = await ctx.service.updateDate.getMainData();

        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            const projectItem = await ctx.service.updateDate.getProjectItemUpdateDate(item.route_table_name);
            if (projectItem && projectItem.updated_at) {
                const updatedAtFormat = moment(projectItem.updated_at).unix();
                ctx.logger.info(`${item.route_table_name}表上次更新时间: ${projectItem.updated_at}`);
                const now = moment().unix();
                const halfDaySecond = 12 * 60 * 60;
                // 更新时间大于12小时执行定时任务
                if ((now - updatedAtFormat) >= halfDaySecond && item.route_table_name) {
                    await ctx.service.configuration.getCrawler(item, item.route_table_name, item.notFoundPath);
                    ctx.logger.info(`${item.route_table_name}开始执行定时任务`);
                }
            }
        }
    }
}

module.exports = TimerCrawl;
