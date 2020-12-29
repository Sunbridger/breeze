import { Subscription } from 'egg';
const fs = require('mz/fs');

class ClearFile extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            cron: '0 0 1 */5 * *', // 间隔: 隔五天天凌晨1点 0 0 1 */5 * *
            type: 'all', // 指定所有的 worker 都需要执行
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        const { ctx } = this;
        const { zipCachePath } = this.config;
        const timeInterval = 5 * 24 * 60 * 60 * 1000;
        const d = new Date();
        const now = d.getTime();
        const files: any = await fs.readdirSync(zipCachePath);
        files.forEach(async value => {
            const fileDate = value.split('-')[1].split('.')[0];
            if ((now - (+fileDate)) > timeInterval) {
                ctx.logger.info(`删除的缓存zip包: ${zipCachePath}/${value}`);
                await fs.unlinkSync(`${zipCachePath}/${value}`);
            }
        });

    }
}

module.exports = ClearFile;
