
export interface ProjectModule {
    entry: string;
    route_table_name: string;
}

export interface Insert {
    file_name: string;
    route_name: string;
    parent_name?: string;
    level: number;
    pid: number;
}
