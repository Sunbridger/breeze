import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
    tableName: 'job_info',
})

export class JobInfo extends Model<JobInfo> {
    @PrimaryKey
    @Column({
        comment: 'jenkins构建时的id',
        field: 'build_id'
    })
    build_id: string;

    @Column({
        comment: '任务开始执行的时间',
        field: 'begin_time'
    })
    begin_time: string;

    @Column({
        comment: '任务构建所花费的时间',
        field: 'duration_time'
    })
    duration_time: string;

    @Column({
        comment: '任务执行状态',
        field: 'result'
    })
    result: string;

    @Column({
        comment: 'jenkins执行的url',
        field: 'jenkins_url'
    })
    jenkins_url: string;

    @Column({
        comment: '执行该任务的容器',
        field: 'built_on'
    })
    built_on: string;

    @Column({
        comment: '从属于哪个项目',
        field: 'belong_project'
    })
    belong_project: string;

    @Column({
        comment: '从属于哪个项目的url',
        field: 'host'
    })
    host: string;

    @Column({
        comment: '本次构建爬取成功数量',
        field: 'success_pages'
    })
    success_pages: string;

    @Column({
        comment: '失败的路由',
        field: 'error_list'
    })
    error_list: string;
}

export default () => JobInfo;