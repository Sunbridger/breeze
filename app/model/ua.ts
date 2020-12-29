import { AutoIncrement, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
    tableName: 'ua_info',
})

export class TodayInfo extends Model<TodayInfo> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        comment: '主键id',
    })
    id: number;

    @Column({
        comment: '访问量',
        field: 'visit_num',
    })
    visit_num: number;

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

    @Column({
        comment: '入表的最初时间',
        field: 'created_date_today',
    })
    created_date_today: Date;
}

export default () => TodayInfo;
