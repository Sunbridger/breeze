import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
    tableName: 'summarize_info',
})

export class SummarizeInfo extends Model<SummarizeInfo> {
    @PrimaryKey
    @Column({
        comment: '项目名',
        field: 'belong_project',
    })
    belong_project: string;

    @Column({
        comment: '主域名',
        field: 'entry',
    })
    entry: string;

    @Column({
        comment: '月访问量',
        field: 'monthVisitSum',
    })
    monthVisitSum: number;

    @Column({
        comment: '项目缓存量',
        field: 'projectCacheSum',
    })
    projectCacheSum: number;

    @Column({
        comment: '昨日访问量',
        field: 'yesterdayVisitSum',
    })
    yesterdayVisitSum: number;

    @Column({
        field: 'created_at',
        comment: '创建时间 from主表'
    })
    created_at: Date;
    @Column({
        field: 'white_path',
        comment: '白名单数组json字符串',
    })
    whitePath: string;

    @Column({
        field: 'ignore_path',
        comment: '忽略路由数组json字符串',
    })
    ignorePath: string;

    @Column({
        field: 'not_found_path',
        comment: '未找到路由数组json字符串',
    })
    notFoundPath: string;

    @Column({
        field: 'ignore_params',
        comment: '忽略参数数组json字符串',
    })
    ignoreParams: string;
}

export default () => SummarizeInfo;
