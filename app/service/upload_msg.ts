import { Service } from 'egg';
import axios from 'axios';

export default class UploadMsgController extends Service {
    async msgCollect(body: any) {
        const { id, success_pages, error_list } = body;
        if (!id) {
            return {
                msg: '缺少id参数',
                error: body,
            };
        }
        this.ctx.logger.info(id, success_pages, error_list, 'breeze-prender传来的参数');
        const result: any = await axios.get(this.config.CiApi.getBuildInfo(id)); // 调用jenkins暴露出的api接口查询该build_id的构建信息
        const data = result.data;
        this.ctx.logger.info(data, 'jenkins的接口返回此id构建信息');
        let belong_project = data.actions[0].parameters[1].value.split('_');
        belong_project.pop();
        belong_project = belong_project.join('-');
        if (belong_project) {
            await this.ctx.model.Job.create({
                build_id: +data.id,
                begin_time: String(data.timestamp || 0),
                duration_time: String(data.duration || 0),
                result: data.result,
                jenkins_url: data.url,
                built_on: data.builtOn,
                host: data.actions[0].parameters[0].value,
                belong_project,
                success_pages,
                error_list,
            });
            this.ctx.logger.info('成功插入到job表');
            return {
                msg: '插入成功',
            };
        }
        return {
            msg: 'belong_project不存在',
            error: result,
        };
    }
}
