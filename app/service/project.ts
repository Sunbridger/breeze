
import { Service } from 'egg';
import { ProjectModule, Insert } from '../module/project';
import utils from '../lib/utils';

const fs = require('mz/fs');
const unzip = require('unzip');

export default class ProjectService extends Service {
    async getProjectService(query: ProjectModule) {
        const { route_table_name } = query;
        const { ctx } = this;
        // 先创建文件夹
        await this.creatDir(route_table_name);
        // 开始下载文件
        // await utils.downloadFile(file_url, zipPath, `${route_table_name}.zip`);
        // 开始解压文件
        try {
            await this.unzip(route_table_name);
        } catch (e) {
            throw new ctx.HttpError.InternalServerError('解压失败');
        }
        // 读取json文件，入库
        await this.getJson(route_table_name);
    }
    /**
     * 创建对应的文件夹，
     *
     */
    async creatDir(route_table_name) {
        const { ctx, config } = this;
        // 创建文件夹目录
        try {
            if (!fs.existsSync(config.dirPath)) {
                await fs.mkdirSync(config.dirPath);
            }
            if (!fs.existsSync(config.zipPath)) {
                await fs.mkdirSync(config.zipPath);
            }
            if (!fs.existsSync(config.zipCachePath)) {
                await fs.mkdirSync(config.zipCachePath);
            }
            if (!fs.existsSync(config.detailPath)) {
                await fs.mkdirSync(config.detailPath);
            }
            if (!fs.existsSync(config.detailCachePath)) {
                await fs.mkdirSync(config.detailCachePath);
            }
            if (!fs.existsSync(`${config.detailPath}/${route_table_name}`)) {
                await fs.mkdirSync(`${config.detailPath}/${route_table_name}`);
            }
        } catch (e) {
            this.ctx.logger.error('文件夹创建失败');
            this.ctx.logger.error(e);
            throw new ctx.HttpError.InternalServerError('系统错误');
        }
    }

    /**
     * 解压文件，并且放置到对应目录
     * @param route_table_name 路由表名称
     */
    async unzip(route_table_name) {
        const { config } = this;
        // 读取压缩包文件夹，是否存在当前压缩包。
        const zipList = await fs.readdirSync(config.zipPath);
        if (zipList.includes(`${route_table_name}.zip`)) {
            return new Promise((resolve, reject) => {
                this.ctx.logger.info(`开始解压 ${config.zipPath}/${route_table_name}.zip `);
                fs.createReadStream(`${config.zipPath}/${route_table_name}.zip`)
                    .pipe(unzip.Extract({ path: config.detailCachePath }))
                    .on('error', err => {
                        this.ctx.logger.error(`压缩包解压失败${err}`);
                        reject(err);
                    })
                    .on('close', () => {
                        resolve(true);
                        this.ctx.logger.info('压缩包解压成功');
                    });
            });
        }
    }
    /**
     * 读取json文件
     * @param route_table_name 路由表名称
     */
    async getJson(route_table_name) {
        const { config } = this;
        const isFileExist = await utils.isFileExist(`${config.detailCachePath}/${route_table_name}/main.json`);
        this.ctx.logger.info(isFileExist, 'isFileExist');
        try {
            const data = await fs.readFileSync(`${config.detailCachePath}/${route_table_name}/main.json`);
            await this.writeMysql(JSON.parse(data).detail, route_table_name);
        } catch (e) {
            this.ctx.logger.error(`${route_table_name}/main.json 数据读取失败: ${e}`);
            throw new this.ctx.HttpError.InternalServerError('系统错误');
        }
    }

    /**
     * 将json文件入库
     * @param data 读取出来的json数据
     * @param route_table_name 路由表名称
     */
    async writeMysql(data, route_table_name) {
        const insertList: any = [];
        // 递归解析
        const readJson = async (data, parent_name: string = '', pid: number = 0) => {
            // 如果传入的是一个数组
            try {
                if (Array.isArray(data)) {
                    for (let i = 0; i < data.length; i++) {
                        const { children, file_name, route_name, level } = data[i];
                        const insert:Insert = { file_name, route_name, level, parent_name, pid };
                        insertList.push(insert);
                        const id: any = await this.handleInsertData(insert, route_table_name);
                        // insertStatus insert  insertID   pid
                        if (Array.isArray(children) && children.length > 0) {
                            await readJson(children, data[i].file_name, id);
                        }
                    }
                }
            } catch (e) {
                this.ctx.logger.error(`${route_table_name}.json 递归解析失败`);
            }
        };
        await readJson(data);

        await this.deleteZip(route_table_name);

        const results = await this.app.mysql.select(route_table_name);
        this.ctx.logger.info(` ${route_table_name} 表共 ${results.length} 条数据`);
        return {
            result: '任务成功',
        };
    }
    /**
     * 删除压缩包，结束任务
     * @param route_table_name
     */
    async deleteZip(route_table_name) {
        const { config } = this;
        try {
            const d = new Date();
            const projectZipPath = `${config.zipPath}/${route_table_name}.zip`;
            const projectZipCachePath = `${config.zipCachePath}/${route_table_name}-${d.getTime()}.zip`;
            await utils.removeFile(`${config.detailCachePath}/${route_table_name}`);
            await utils.moveFile(projectZipPath, projectZipCachePath);
            // await fs.unlinkSync(`${zipPath}/${route_table_name}.zip`);
            this.ctx.logger.info('临时文件删除成功, 任务结束');
        } catch (e) {
            this.ctx.logger.info('临时文件删除失败');
            this.ctx.logger.info(e);
        }
    }
    /**
     * 将文件映射入库
     * @param insert
     * @param route_table_name
     */
    async handleInsertData(insert: Insert, route_table_name) {
        const { config } = this;
        const oldPath = `${config.detailCachePath}/${route_table_name}/${insert.file_name}.html`;
        const isFileExist = await utils.isFileExist(oldPath);

        if (!isFileExist) {
            return;
        }
        let insertStatus: any = {};
        const record = await this.app.mysql.get(route_table_name, { route_name: insert.route_name }) || {};

        try {
            if (record.id) {
                const options = {
                    where: {
                        id: record.id,
                    },
                };
                insertStatus = await this.app.mysql.update(route_table_name, insert, options) || {};
            } else {
                insertStatus = await this.app.mysql.insert(route_table_name, insert) || {};
            }
        } catch (e) {
            this.ctx.logger.error(`${route_table_name} 表数据写入失败`);
            this.ctx.logger.error(`${route_table_name} ${e}`);
            throw new this.ctx.HttpError.InternalServerError('系统错误');
        }
        try {
            await this.handleCombineFiles(route_table_name, insert, record);
        } catch (e) {
            this.ctx.logger.error(`${route_table_name} ${e}`);
        }
        return record.id ? record.id : insertStatus.insertId;
    }
    /**
     * html文件合并保存
     * @param route_table_name
     * @param insertStatus
     * @param record
     */
    async handleCombineFiles(route_table_name, insert, record) {
        const { config } = this;
        const recordFilePath = `${config.detailPath}/${route_table_name}/${record.file_name}.html`;
        const isFileExist = await utils.isFileExist(recordFilePath);
        if (isFileExist) {
            await fs.unlinkSync(recordFilePath);
        }
        const oldPath = `${config.detailCachePath}/${route_table_name}/${insert.file_name}.html`;
        const newPath = `${config.detailPath}/${route_table_name}/${insert.file_name}.html`;
        try {
            await utils.moveFile(oldPath, newPath);
        } catch (e) {
            this.ctx.logger.error(`${newPath} 文件转移失败`);
        }
    }
}
