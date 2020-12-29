module.exports = {
    schedule: {
        cron: '0 1 0 * * *', // 每日0点执行
        type: 'all', // 指定所有的 worker 都需要执行
        immediate: true,
    },
    async task(ctx) {
        ctx.logger.info(`开始执行同步昨日数据的定时任务`);
        await ctx.service.updateDate.moveInfo();
        ctx.logger.info(`执行同步昨日数据的定时任务完成`);
        await ctx.service.updateDate.updateJobInfo();
        ctx.logger.info(`同步Job表完成`);
    },
};
