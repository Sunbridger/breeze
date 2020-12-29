
export interface ConfigurationModule {
    id?: number;
    entry: string;
    moduleName: string;
    route_table_name?: string;
    whitePath?: string;
    ignorePath?: string;
    ignoreParams?: string;
    isSubproject?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
