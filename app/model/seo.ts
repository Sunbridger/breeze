import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
    tableName: 'seo_info',
})

export class SeoInfo extends Model<SeoInfo> {
    @PrimaryKey
    @Column({
        comment: '从属于哪个项目',
        field: 'belong_project',
    })
    belong_project: string;

    @Column({
        comment: '百度收录',
        field: 'bdi',
    })
    bdi: string;

    @Column({
        comment: '百度反链',
        field: 'bda',
    })
    bda: string;

    @Column({
        comment: 'google收录',
        field: 'goi',
    })
    goi: string;

    @Column({
        comment: 'google反链',
        field: 'goa',
    })
    goa: string;

    @Column({
        comment: '360收录',
        field: 'tsi',
    })
    tsi: string;

    @Column({
        comment: '360反链',
        field: 'tsa',
    })
    tsa: string;

    @Column({
        comment: '搜狗收录',
        field: 'sgi',
    })
    sgi: string;

    @Column({
        comment: '搜狗反链',
        field: 'sga',
    })
    sga: string;

    @Column({
        comment: 'bing收录',
        field: 'bgi',
    })
    bgi: string;

    @Column({
        comment: 'bing反链',
        field: 'bga',
    })
    bga: string;

    @Column({
        comment: '创建时间',
        field: 'created_date',
    })
    created_date: Date;
}

export default () => SeoInfo;
