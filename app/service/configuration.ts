

import { Service } from 'egg';
import utils from '../lib/utils';
import { ConfigurationModule } from '../module/configuration';
import project from '../model/project';
import axios from 'axios';

export default class ConfigurationService extends Service {

    private tabName: string;
    async getServiceConfig(query: ConfigurationModule) {
        const { ctx } = this;
        // 查询是否存在
        const user = await ctx.model.Init.findOne({
            where: { entry: query.entry },
        });

        let updateResult:any = null;
        let tableName: any = '';
        // 如果不存在，
        if (!user) {
            this.tabName = query.route_table_name = `${query.moduleName.replace(/-/g, '_')}_${utils.createHash()}`; // 将finance-brance-app -> finance_brance_app_ikh0vr0hy0zmrz5ukzt2s7nv
            // 写入数据库 （首先写入到主表 seo_tab 再 写入到附表）
            updateResult = await ctx.model.Init.create(query);
            if (updateResult.dataValues) {
                // 写入到主表成功，开始创建附表
                tableName = await this.createProjectTable(updateResult.dataValues);
            }
            await this.getCrawler(query, tableName);
        } else {
            // 如果数据库已经存在，则取出数据库中的数据，与传入的新数据做对比。
            const { whitePath, ignorePath, ignoreParams, route_table_name, notFoundPath } = user.dataValues;
            // 子项目必须和主项目忽略参数一致
            if (query.isSubproject) {
                query.ignoreParams = ignoreParams;
            }
            if (whitePath !== query.whitePath || ignorePath !== query.ignorePath || ignoreParams !== query.ignoreParams) {
                // 更新配置参数
                updateResult = user.update({
                    whitePath,
                    ignorePath,
                    ignoreParams,
                });
                // 数据有变动，直接请求，去爬取
                await this.getCrawler(query, route_table_name, notFoundPath);
            }
        }
        return {
            result: updateResult,
        };
    }
    /**
     * 写入数据成功，开始创建附表，
     * @param query {}
     * @param insertInfo
     * @return String
     */
    async createProjectTable(insertInfo) {
        const { ctx, tabName } = this;
        // 动态创建对应的数据表
        try {
            await this.app.mysql.query(project.createTable(tabName));
            this.ctx.logger.info(`${tabName} 附表创建成功`);
            const updateSeoTab = await ctx.model.Init.findById(insertInfo.id);
            if (!updateSeoTab) {
                throw new Error();
            }
            return tabName;
        } catch (e) {
            throw new this.ctx.HttpError.InternalServerError('附表创建失败');
        }
    }
    /**
     * 如果数据有变更，直接发送请求，立刻去爬
     * @param query {} where
     * @returns result: { ConfigurationModule }
     */

    async getCrawler(query: ConfigurationModule, route_table_name, notFoundPath?) {
        const { whitePath, ignorePath, ignoreParams, entry, isSubproject } = query;
        const { CiApi, Const } = this.config;
        const { ctx } = this;
        ctx.logger.info('====================================query====================================');
        ctx.logger.info(`${route_table_name}有变动去请求`);
        const params = {
            ENTRY: entry,
            MODULE_NAME: route_table_name,
            IGNORE_PATH: ignorePath,
            WHITE_PATH: whitePath,
            IGNORE_PARAMS: ignoreParams,
            token: Const.CI_API_TOKEN,
            IS_SUBPROJECT: isSubproject,
            NOT_FOUND_PATH: '[]',
            ALLPROJECTINFO: '[]',
        };

        if (notFoundPath) {
            params.NOT_FOUND_PATH = notFoundPath;
            const user: any = await ctx.model.Init.findOne({
                where: { entry },
            });
            if (user) {
                user.update({
                    notFoundPath: '',
                });
            }
        }
        await axios.get(CiApi.buildProject, { params });
    }

}
