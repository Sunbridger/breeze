
import { Application } from 'egg';
/**
 * 获取配置/api/开头
 *
 */
export default (app: Application) => {
    const { router, controller } = app;
    // 根据那过来的请求，判断是否初步入库
    router.post('/api/createSeoTask', controller.configuration.getControllConfig);

    router.post('/api/uploadZip', controller.uploadFile.upload);

    // 主页概览查询
    router.get('/pc/getOverviewData', controller.pc.getOverviewData);
    // 项目概况查询
    router.get('/pc/projectDetail', controller.pc.projectDetail);
    // 项目访问量接口
    router.get('/pc/getVisitNum', controller.pc.getVisitNum);
    // 项目爬虫引擎占比接口
    router.get('/pc/getTopFiveSpider', controller.pc.getTopFiveSpider);
    // 项目页面Top10占比接口
    router.get('/pc/getTopTenPage', controller.pc.getTopTenPage);
    // jenkins任务收集
    router.post('/api/msgCollect', controller.uploadMsg.msgCollect);
    // jenkins 爬取站长之家seo信息
    router.post('/api/updateSeoInfo', controller.uploadMsg.updateSeoInfo);

    // 根据url获取网站截图
    router.get('/api/screenshot/getScreenshotImage', controller.screenshot.getScreenshotImage);

    router.get(/^\/.*$/, controller.render.getHtmlContent);

};
