
import { Service } from 'egg';
import sequelize from 'sequelize';
const Op = sequelize.Op;

export default class Api extends Service {
    async getOverviewData() {
        const { ctx } = this;
        const items = await ctx.model.Summarize.findAll();
        let yesterdayVisitNum = 0;
        let monthVisitNum = 0;
        items.forEach(row => {
            yesterdayVisitNum += Number(row.dataValues.yesterdayVisitSum);
            monthVisitNum += Number(row.dataValues.monthVisitSum);
        });
        return {
            projectNum: items.length,
            yesterdayVisitNum,
            monthVisitNum,
            items
        }
    }
    async projectDetail(query) {
        const { ctx } = this;
        const { moduleName, entry} = query;
        const seoInfo: any = await ctx.model.Seo.findOne({
            where: { belong_project: moduleName }
        });
        const taskItems = await ctx.model.Job.findAll({
            where: { host: entry }
        });
        const todayVisitNum = await ctx.model.Today.findAll({
            raw: true,
            attributes: [[sequelize.fn('SUM', sequelize.col('visit_num')), 'todayVisitNum']],
            where: { belong_project: moduleName }
        });
        return {
            seoInfo,
            taskItems,
            ...todayVisitNum[0]
        }
    }
    async getVisitNum(query) {
        const { ctx } = this;
        const { moduleName, rang } = query;
        if (rang) {
            return await ctx.model.Visit.findAll({
                attributes: [[sequelize.literal(`DATE_FORMAT(created_date_today, '%Y-%m-%d')`), 'data_x'], [sequelize.fn('SUM', sequelize.col('visit_num')), 'data_y']],
                where: {
                    belong_project: moduleName,
                    created_date_today: {
                        [Op.between]: rang.split(',')
                    }
                },
                group: 'data_x',
                order: sequelize.literal('created_date_today')
            });
        }
        return await ctx.model.Visit.findAll({
            attributes: [[sequelize.literal(`DATE_FORMAT(created_date_today, '%Y-%m-%d')`), 'data_x'], [sequelize.fn('SUM', sequelize.col('visit_num')), 'data_y']],
            where: {
                belong_project: moduleName,
                created_date_today: {
                    [Op.gt]: sequelize.literal('DATE_SUB(CURDATE(),INTERVAL 7 DAY)'),
                    [Op.lt]: sequelize.literal('DATE(now())')
                }
            },
            group: 'data_x',
            order: sequelize.literal('created_date_today')
        });
    }
    async getTopFiveSpider(query) {
        const { ctx } = this;
        const { moduleName, rang } = query;
        return await ctx.model.Ua.findAll({
            attributes: [[sequelize.fn('SUM', sequelize.col('visit_num')), 'value'], ['ua', 'name']],
            where: {
                belong_project: moduleName,
                created_date_today: {
                    [Op.gt]: sequelize.literal(`DATE_SUB(CURDATE(),INTERVAL ${rang} DAY)`),
                    [Op.lt]: sequelize.literal(`DATE(now())`)
                }
            },
            group: 'name',
            order: sequelize.literal('value DESC'),
            limit: 5
        });
    }
    async getTopTenPage(query) {
        const { ctx } = this;
        const { moduleName, rang } = query;
        return await ctx.model.Month.findAll({
            attributes: [[sequelize.fn('SUM', sequelize.col('visit_num')), 'num'], 'son_router'],
            where: {
                belong_project: moduleName,
                created_date_today: {
                    [Op.gt]: sequelize.literal(`DATE_SUB(CURDATE(),INTERVAL ${rang} DAY)`),
                    [Op.lt]: sequelize.literal(`DATE(now())`)
                }
            },
            group: 'son_router',
            order: sequelize.literal('num DESC'),
            limit: 10
        });
    }
}
