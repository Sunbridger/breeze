import { AutoIncrement, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
    tableName: 'month_info',
})

export class MonthInfo extends Model<MonthInfo> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        comment: '主键id',
    })
    id: number;

    @Column({
        comment: '月访问量',
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
        comment: '每天插入的时间',
        field: 'created_date',
    })
    created_date: Date;

    @Column({
        comment: '入表的最初时间',
        field: 'created_date_today',
    })
    created_date_today: Date;

}

export default () => MonthInfo;
