import { Logger } from "./logger";
const bunyan = require('bunyan');

export class BunyanImpl implements Logger {

    private static _instance: Logger = new BunyanImpl();
    private readonly logger: any;

    constructor() {
        if (BunyanImpl._instance) {
            throw new Error('Unable to instantiate Logger, use getInstance()');
        }

        this.logger = bunyan.createLogger({
            name: 'auto-dns',
            src: false,
            streams: [
                {
                    level: 'info',
                    stream: process.stdout,
                },
                {
                    level: 'info',
                    path: '/var/log/auto-dns/auto-dns.info.log'
                }
            ]
        });
    }

    public static getInstance(): Logger {
        return BunyanImpl._instance;
    }

    public info(message: string): void {
        this.logger.info(message);
    }

    public warn(message: string): void {
        this.logger.warn(message);
    }

    public error(message: string): void {
        this.logger.error(message);
    }

    public debug(message: string): void {
        this.logger.debug(message);
    }
}