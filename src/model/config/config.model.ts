
export class Config {
    readonly username: string;
    readonly password: string;
    readonly domains: Domain[] = [];

    constructor(username: string,
        password: string,
        domains: Domain[]) {
        this.username = username;
        this.password = password;
        for (const domain of domains) {
            this.domains.push(new Domain(domain['name'], domain['records']));
        }
    }
}

export class Domain {
    readonly name: string;
    readonly records: Record[] = [];
    constructor(name: string,
        records: Record[]) {
        this.name = name;
        for (const record of records) {
            this.records.push(new Record(record['name'], record['type']));
        }
    }
}

export class Record {
    readonly name: string;
    readonly type: string;
    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }
}