import { AutoIncrement, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
    tableName: 'today_info',
})

export class TodayInfo extends Model<TodayInfo> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        comment: '主键id',
    })
    id: number;

    @Column({
        comment: '今日访问量',
        field: 'visit_num',
    })
    visit_num: number;

    @Column({
        comment: '爬虫的各个地址',
        field: 'son_router',
    })
    son_router: string;

    @Column({
        comment: '从属于哪个项目',
        field: 'belong_project',
    })
    belong_project: string;
    
    @Column({
        comment: 'User-Agent信息',
        field: 'ua',
    })
    ua: string;

    @Column({
        field: 'created_date',
    })
    created_date: Date;
}

export default () => TodayInfo;