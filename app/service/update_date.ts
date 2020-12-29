

import { Service } from 'egg';
import sequelize from 'sequelize';
import axios from 'axios';
const Op = sequelize.Op;
export default class UpdateDate extends Service {
    async getMainData() {
        const { ctx } = this;
        const results = await ctx.model.Init.findAll();
        return results;
    }
    async getProjectItemUpdateDate(route_table_name) {
        const result = await this.app.mysql.get(route_table_name, { id: 1 });
        return result;
    }
    async moveInfo() {
        // 1. 将今日数据同步到 visit、ua、month以及聚合数据至summarize表中
        // 2. 清除today表
        await this.saveToVisitInfo();
        await this.saveToUaInfo();
        await this.saveToMonthInfo();
        await this.saveToSummarizeInfo();
        await this.deletToday();
    }
    async deletToday() {
        try {
            await this.ctx.model.Today.destroy({
                truncate: true,
                force: true
            });
        } catch (e) {
            this.ctx.logger.info(`删除today表数据时出现 ${e.message} 错误`);
        }
    }
    async saveToVisitInfo() {
        // 1. 将超过一年的数据删除
        await this.app.mysql.query('DELETE FROM visit_info WHERE (DATEDIFF(CURDATE(), `created_date_today`)) >= 365;');
        const queryArr: any = await this.ctx.model.Today.findAll({
            raw: true,
            attributes: ['belong_project', [sequelize.fn('sum', sequelize.col('visit_num')), 'visit_num'], [sequelize.fn('Date', sequelize.col('created_date')), 'created_date_today']],
            group: ['belong_project']
        });
        // 2. 将每天的新数据批量插入到表中
        try {
            await this.ctx.model.Visit.bulkCreate(queryArr);
        } catch (e) {
            this.ctx.logger.info(`插入到visit表中出现 ${e.message} 错误`);
        }
    }
    async saveToMonthInfo() {
        // 1. 将超过一个月的数据删除
        await this.app.mysql.query('DELETE FROM month_info WHERE (DATEDIFF(CURDATE(), `created_date_today`)) >= 31;');
        const queryArr = await this.ctx.model.Today.findAll({
            raw: true,
            attributes: ['son_router', 'belong_project', [sequelize.fn('sum', sequelize.col('visit_num')), 'visit_num'], ['created_date', 'created_date_today']],
            group: ['son_router']
        });
        // 2. 将每天的新数据批量插入到表中
        try {
            await this.ctx.model.Month.bulkCreate(queryArr);
        } catch (e) {
            this.ctx.logger.info(`插入到month表中出现 ${e.message} 错误`);
        }
    }
    async saveToUaInfo() {
        // 1. 将超过一个月的数据删除
        await this.app.mysql.query('DELETE FROM ua_info WHERE (DATEDIFF(CURDATE(), `created_date_today`)) >= 31;');
        const queryArr = await this.ctx.model.Today.findAll({
            raw: true,
            attributes: ['ua', 'belong_project', [sequelize.fn('sum', sequelize.col('visit_num')), 'visit_num'], ['created_date', 'created_date_today']],
            group: ['ua', 'belong_project']
        });
        // 2. 将每天的新数据批量插入到表中
        try {
            await this.ctx.model.Ua.bulkCreate(queryArr);
        } catch (e) {
            this.ctx.logger.info(`插入到ua表中出现 ${e.message} 错误`);
        }
    }
    // 该表作用是将月表的数据查询聚合起来 类似redis的作用
    async saveToSummarizeInfo() {
        const { ctx, app } = this;
        const projectInfo = await ctx.model.Init.findAll();
        await Promise.all(projectInfo.map(async row => {
            const yesterdayVisitSum = await ctx.model.Visit.findAll({
                raw: true,
                attributes: [[sequelize.fn('SUM', sequelize.col('visit_num')), 'yesterdayVisitSum']],
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('DATE', sequelize.col('created_date_today')), sequelize.literal('DATE_SUB(CURDATE(), INTERVAL 1 DAY)')),
                        { belong_project: row.moduleName }
                    ]
                }
            });
            const projectCacheSum = await app.mysql.query(`SELECT count(id) as projectCacheSum FROM ${row.route_table_name};`);
            const monthVisitSum: any = await ctx.model.Visit.findAll({
                raw: true,
                attributes: [[sequelize.fn('SUM', sequelize.col('visit_num')), 'monthVisitSum']],
                where: {
                    belong_project: row.moduleName,
                    created_date_today: {
                        [Op.gt]: sequelize.literal(`DATE_SUB(CURDATE(), INTERVAL 31 DAY)`),
                        [Op.lt]: sequelize.literal(`DATE(now())`)
                    }
                },
            });
            const query = {
                belong_project: row.moduleName,
                entry: row.entry,
                created_at: row.created_at,
                whitePath: row.whitePath,
                ignorePath: row.ignorePath,
                notFoundPath: row.notFoundPath,
                ignoreParams: row.ignoreParams,
                ...monthVisitSum[0],
                ...yesterdayVisitSum[0],
                ...projectCacheSum[0]
            };
            const hasVal = await ctx.model.Summarize.findByPk(row.moduleName);
            if (!hasVal) {
                await ctx.model.Summarize.create(query);
            } else {
                await hasVal.update(query);
            }
        }));
    }
    async updateSeoInfo(allProjectInfo) {
        const { ctx } = this;
        if (allProjectInfo.length) {
            allProjectInfo.forEach(async projectInfo => {
                if (projectInfo.moduleName) {
                    projectInfo.belong_project = projectInfo.moduleName;
                    const hasVal = await ctx.model.Seo.findByPk(projectInfo.belong_project);
                    if (!hasVal) {
                        await ctx.model.Seo.create(projectInfo);
                    } else {
                        await hasVal.update(projectInfo);
                    }
                    ctx.logger.info(`✅${projectInfo.moduleName}项目完成了本次任务`);
                }
            });
            return {
                msg: '更新seoInfo表成功'
            }
        }
        return {
            msg: '更新失败',
            error: JSON.stringify(allProjectInfo)
        }
    }
    async updateJobInfo() {
        const { ctx } = this;
        const allJobId = await ctx.model.Job.findAll({
            attributes: ['build_id'],
            where: { duration_time: 0 }
        });
        if (allJobId.length) {
            await Promise.all(allJobId.map(async (jenkisdata: any) => {
                const build_id = jenkisdata.dataValues.build_id;
                const result: any = await axios.get(this.config.CiApi.getBuildInfo(build_id));
                const data = result.data;
                ctx.logger.info(data, 'jenkins的接口返回此id构建信息');
                const thisIdData = await ctx.model.Job.findByPk(build_id);
                if (thisIdData) {
                    const query = {
                        duration_time: String(data.duration || 0),
                        result: data.result,
                    };
                    thisIdData.update(query);
                    ctx.logger.info('更新Job表成功');
                }
            }));
        }
    }
}
