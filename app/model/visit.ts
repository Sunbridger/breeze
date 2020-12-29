import { AutoIncrement, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
    tableName: 'visit_info',
})

export class VisitInfo extends Model<VisitInfo> {
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

export default () => VisitInfo;
