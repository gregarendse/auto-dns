export interface Config {
    username: string;
    password: string;
    domains: {
        name: string;
        records: {
            name: string;
            type: string;
        }[];
    }[];
}
