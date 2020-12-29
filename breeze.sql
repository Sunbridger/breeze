CREATE TABLE `breeze-default`.`today_info`(
        id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增id',
        created_date datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        son_router VARCHAR(250) NOT NULL COMMENT '访问的子路由地址',
        visit_num INT COMMENT '每日实时的访问量',
        belong_project VARCHAR(500)  COMMENT '从属于哪个项目',
        ua VARCHAR(500)  COMMENT 'user-Agent信息',
        PRIMARY KEY ( id )
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='今日爬虫数据';

CREATE TABLE `breeze-default`.`month_info`(
        id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增id',
        created_date datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        son_router VARCHAR(500) NOT NULL COMMENT '访问的子路由地址',
        visit_num INT COMMENT '一个月下的访问量',
        belong_project VARCHAR(500)  COMMENT '从属于哪个项目',
        PRIMARY KEY ( id )
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='月爬虫数据';

CREATE TABLE `breeze-default`.`ua_info`(
        id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增id',
        created_date datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        visit_num INT COMMENT '一个月下的访问量',
        belong_project VARCHAR(500) NOT NULL  COMMENT '从属于哪个项目',
        ua VARCHAR(500)  NOT NULL  COMMENT 'user-Agent信息',
        PRIMARY KEY ( id )
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ua信息';
        
CREATE TABLE `breeze-default`.`job_info`(
        build_id INT UNSIGNED NOT NULL COMMENT 'jenkins构建时的id',
        begin_time VARCHAR(100) NOT NULL COMMENT '任务开始执行的时间',
        duration_time VARCHAR(100) COMMENT '任务构建所花费的时间',
        result VARCHAR(10) COMMENT '任务执行状态',
        jenkins_url VARCHAR(500) COMMENT 'jenkins执行的url',
        built_on VARCHAR(50) COMMENT '执行该任务的容器',
        host VARCHAR(500) NOT NULL  COMMENT '从属于哪个项目的host',
        belong_project VARCHAR(500) NOT NULL  COMMENT '从属于哪个项目',
        success_pages VARCHAR(10) COMMENT '本次构建爬取成功数量',
        error_list VARCHAR(500) COMMENT '失败的路由',
        PRIMARY KEY ( build_id )
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务执行情况';
        
CREATE TABLE `breeze-default`.`seo_info`(
        belong_project VARCHAR(150) NOT NULL  COMMENT '从属于哪个项目',
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='引擎名称';

alter table `breeze-default`.month_info add created_date_today datetime COMMENT '入表的最初时间';
alter table `breeze-default`.month_info add created_date_today datetime COMMENT '入表的最初时间';

ALTER TABLE `breeze`.`month_info` ADD `created_date_today` datetime COMMENT '插入时间字段';

ALTER TABLE  `breeze`.`ua_info` ADD `created_date_today` datetime COMMENT '插入时间字段';
