
export default {
    // 创建数据库主表
    createSeoTable() {
        return `CREATE TABLE seo_tab(
        id INT NOT NULL AUTO_INCREMENT COMMENT '自增id',
        module_name VARCHAR(100) DEFAULT '' COMMENT '项目名称',
        entry VARCHAR(100) NOT NULL COMMENT '生产入口地址',
        route_table_name VARCHAR(200) DEFAULT '' COMMENT '路由对应表',
        white_path VARCHAR(500) DEFAULT '' COMMENT '白名单数组json字符串',
        not_found_path VARCHAR(500) DEFAULT '' COMMENT '未找到路由数组json字符串',
        ignore_path VARCHAR(500) DEFAULT '' COMMENT '忽略路由数组json字符串',
        ignore_params VARCHAR(500) DEFAULT '' COMMENT '忽略参数数组json字符串',
        created_at datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        PRIMARY KEY ( id ),
        INDEX entry (entry(100))
        )`;
    },
    // 创建today_info表 记录一些数据
    createTodayInfoTable() {
        return `CREATE TABLE today_info(
        id INT NOT NULL AUTO_INCREMENT COMMENT '自增id',
        created_date datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        son_router VARCHAR(500) NOT NULL COMMENT '访问的子路由地址',
        visit_num INT COMMENT '每日实时的访问量',
        belong_project VARCHAR(50)  COMMENT '从属于哪个项目',
        ua VARCHAR(500)  COMMENT 'user-Agent信息',
        PRIMARY KEY ( id ),
        INDEX belong_project (belong_project(50))
        )`;
    },
    // 创建month_info表 记录一些数据
    createMonthInfoTable() {
        return `CREATE TABLE month_info(
        id INT NOT NULL AUTO_INCREMENT COMMENT '自增id',
        created_date datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        son_router VARCHAR(500) NOT NULL COMMENT '访问的子路由地址',
        visit_num INT COMMENT '一个月下的访问量',
        belong_project VARCHAR(50)  COMMENT '从属于哪个项目',
        created_date_today datetime COMMENT '入表的最初时间',
        PRIMARY KEY ( id ),
        INDEX belong_project (belong_project(50))
        )`;
    },
    // 创建ua_info表 记录一些数据
    createUaInfoTable() {
        return `CREATE TABLE ua_info(
        id INT NOT NULL AUTO_INCREMENT COMMENT '自增id',
        created_date datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        visit_num INT COMMENT '一个月下的访问量',
        belong_project VARCHAR(50) NOT NULL  COMMENT '从属于哪个项目',
        ua VARCHAR(500)  NOT NULL  COMMENT 'user-Agent信息',
        created_date_today datetime COMMENT '入表的最初时间',
        PRIMARY KEY ( id ),
        INDEX belong_project (belong_project(50))
        )`;
    },
    // 创建job_info表 记录一些数据
    createJobInfoTable() {
        return `CREATE TABLE job_info(
        build_id INT NOT NULL COMMENT 'jenkins构建时的id',
        begin_time VARCHAR(100) NOT NULL COMMENT '任务开始执行的时间',
        duration_time VARCHAR(100) COMMENT '任务构建所花费的时间',
        result VARCHAR(10) COMMENT '任务执行状态',
        jenkins_url VARCHAR(500) COMMENT 'jenkins执行的url',
        built_on VARCHAR(50) COMMENT '执行该任务的容器',
        host VARCHAR(500) NOT NULL  COMMENT '从属于哪个项目的host',
        belong_project VARCHAR(50) NOT NULL  COMMENT '从属于哪个项目',
        success_pages VARCHAR(10) COMMENT '本次构建爬取成功数量',
        error_list VARCHAR(500) COMMENT '失败的路由',
        PRIMARY KEY ( build_id ),
        INDEX belong_project (belong_project(50))
        )`;
    },
    // 创建seo_info表 记录一些数据
    createSeoInfoTable() {
        return `CREATE TABLE seo_info(
        belong_project VARCHAR(500) NOT NULL  COMMENT '从属于哪个项目',
        bdi VARCHAR(20) DEFAULT 0 COMMENT '百度收录',
        bda VARCHAR(20) DEFAULT 0 COMMENT '百度反链',
        goi VARCHAR(20) DEFAULT 0 COMMENT '谷歌收录',
        goa VARCHAR(20) DEFAULT 0 COMMENT '谷歌反链',
        tsi VARCHAR(20) DEFAULT 0 COMMENT '360收录',
        tsa VARCHAR(20) DEFAULT 0 COMMENT '360反链',
        sgi VARCHAR(20) DEFAULT 0 COMMENT '搜狗收录',
        sga VARCHAR(20) DEFAULT 0 COMMENT '搜狗反链',
        bgi VARCHAR(20) DEFAULT 0 COMMENT 'bing收录',
        bga VARCHAR(20) DEFAULT 0 COMMENT 'bing反链',
        created_date datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        PRIMARY KEY (belong_project)
        )`;
    },
    // 创建summarize_info表 记录一些数据
    createSummarizeInfoTable() {
        return `CREATE TABLE summarize_info(
        belong_project VARCHAR(100) NOT NULL COMMENT '项目名',
        entry VARCHAR(500) NOT NULL COMMENT '主域名',
        monthVisitSum VARCHAR(10) COMMENT '月爬虫访问量',
        projectCacheSum VARCHAR(10) COMMENT '项目缓存页面数',
        yesterdayVisitSum VARCHAR(10) COMMENT '昨日爬虫访问量',
        created_at datetime COMMENT '创建时间 from主表',
        white_path VARCHAR(500) COMMENT '白名单数组json字符串',
        not_found_path VARCHAR(500) COMMENT '未找到路由数组json字符串',
        ignore_path VARCHAR(500) COMMENT '忽略路由数组json字符串',
        ignore_params VARCHAR(500) COMMENT '忽略参数数组json字符串',
        PRIMARY KEY (belong_project)
        )`;
    },
    // 创建visit_info表 单独服务于访问量
    createVisitInfoTable() {
        return `CREATE TABLE visit_info(
            id INT NOT NULL AUTO_INCREMENT COMMENT '自增id',
            belong_project VARCHAR(50)  COMMENT '从属于哪个项目',
            visit_num INT COMMENT '一个月下的访问量',
            created_date datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
            created_date_today datetime COMMENT '入表的最初时间',
            PRIMARY KEY ( id ),
            INDEX belong_project (belong_project(50))
        )`;
    },
    addField() {
        return {
            sql_add_field_month: 'ALTER TABLE `month_info` ADD `created_date_today` datetime;',
            sql_add_field_ua: 'ALTER TABLE `ua_info` ADD `created_date_today` datetime;',
            sql_add_index_month: 'ALTER TABLE `month_info` ADD INDEX `belong_project` (`belong_project`), ADD INDEX `son_router` (`son_router`);',
            sql_add_index_ua: 'ALTER TABLE `ua_info` ADD INDEX `belong_project` (`belong_project`);',
            update_created_date_today: 'UPDATE `month_info` set `created_date_today` = `created_date`; UPDATE `ua_info` set `created_date_today` = `created_date`;',
            update_monthto_visit: 'INSERT INTO visit_info (belong_project, visit_num, created_date_today) SELECT belong_project, sum(visit_num), Date(created_date_today) FROM `month_info` group by belong_project, Date(created_date_today);'
        };
    }
};
