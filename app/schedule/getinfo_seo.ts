import { Subscription } from 'egg';
// import axios from 'axios';

class GetInfoSeo extends Subscription {
    static get schedule() {
        return {
            cron: '0 10 1 */7 * *', // 间隔: 每隔一周凌晨4点 0 0 4 */7 * *
            type: 'all',
            immediate: true,
        };
    }

    async subscribe() {
        console.log('暂时去除站长之家数据的爬取');

        // const allProjectInfo = await ctx.model.Init.findAll({
        //     attributes: [ 'entry', 'module_name' ],
        // });
        // if (allProjectInfo.length) {
        //     const { CiApi, Const } = config;
        //     const params = {
        //         ALLPROJECTINFO: JSON.stringify(allProjectInfo),
        //         token: Const.CI_API_TOKEN,
        //         TYPE: 'SEOINFO',
        //     };
        //     await axios.get(CiApi.buildProject, { params });
        // }
    }
}

module.exports = GetInfoSeo;
