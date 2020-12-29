const fs = require('mz/fs');
const path = require('path');
import { Controller } from 'egg';
const pump = require('mz-modules/pump');
import utils from '../lib/utils';

export default class UploadController extends Controller {
    rule() {
        return {
            projectConfigRule: {
                entry: { type: 'string', required: true },
                route_table_name: { type: 'string', required: true },
            },
        };
    }
    async createFile() {
        const dirPath = path.join(this.config.baseDir, 'download');
        const zipPath = `${dirPath}/zip`;
        try {
            if (!fs.existsSync(dirPath)) {
                await fs.mkdirSync(dirPath);
            }
            if (!fs.existsSync(zipPath)) {
                await fs.mkdirSync(zipPath);
            }
        } catch (e) {
            this.ctx.logger.error('文件夹创建失败');
            this.ctx.logger.error(e);
        }
    }
    async handleFileExist(targetPath) {
        const isFileExist = await utils.isFileExist(targetPath);
        if (isFileExist) {
            try {
                await fs.unlinkSync(targetPath);
            } catch (e) {
                this.ctx.logger.error('zip文件删除失败');
            }
        }
    }
    async upload() {
        const { ctx } = this;
        const route_table_name = ctx.headers.filename;
        const filename = `${route_table_name}.zip`;
        const entry = ctx.headers.entry;
        const targetPath = path.join(this.config.baseDir, 'download/zip/', filename);
        ctx.logger.info(`Received a file: ${filename}, length: ${ctx.request.length}`);
        await this.handleFileExist(targetPath);
        await this.createFile();
        const stream = await ctx.getFileStream();
        const writeStream = fs.createWriteStream(targetPath);
        try {
            await pump(stream, writeStream);
        } catch (err) {
            ctx.logger.info('文件上传失败');
            throw new ctx.HttpError.InternalServerError('文件上传失败');
        }
        ctx.body = await this.getProjectConfig({
            route_table_name,
            entry,
        });
    }

    async getProjectConfig(query) {
        const rule = this.rule().projectConfigRule;
        const ctx = this.ctx;
        // 验证
        this.ctx.validate(rule, query);
        return await ctx.service.project.getProjectService(query);
    }
}
