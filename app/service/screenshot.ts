import { Service } from 'egg';
import axios from 'axios';

export default class UploadMsgController extends Service {
    static randomChar(l) {
        const x = '0123456789qwertyuioplkjhgfdsazxcvbnm';
        let tmp = '';
        const timestamp = new Date().getTime();
        for (let i = 0; i < l; i++) {
            tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
        }
        return `${tmp}_${timestamp}`;
    }

    async doScreenshotTask(query: any) {
        const { CiApi, Const } = this.config;
        const ossPath = 'http://souche.oss-cn-hangzhou.aliyuncs.com/breeze/screenshot/';
        const randomKey = UploadMsgController.randomChar(5);
        const fileName = `breeze_screenshot_${randomKey}.jpg`;
        const params = {
            TYPE: 'SCREENSHOT',
            token: Const.CI_API_TOKEN,
            SCREENSHOTFILENAME: fileName,
            SCREENSHOTURL: query.url,
            SCREENSHOTWIDTH: query.screenWidth,
        };
        await axios.get(CiApi.buildProject, { params });
        return {
            imageUrl: `${ossPath}${fileName}`,
        };
    }
}
