import { Logger } from './logger';
import * as winston from 'winston';
import * as fs from 'fs';
import { files } from '../utils/file.util';

const logDir: string = '/var/log/auto-dns';

export class WinstonImpl implements Logger {
    private static _instance: Logger = new WinstonImpl();
    private readonly logger: winston.Logger;

    constructor() {
        if (WinstonImpl._instance) {
            throw new Error('Unable to instantiate Logger, use getInstance()');
        }

        if (!fs.existsSync(logDir)) {
            files.mkdirPath(logDir);
        }

        const format = winston.format.printf((info) => `${info.timestamp} ${info.level} - ${info.message}`);

        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                format
            ),
            transports: [
                new winston.transports.File({
                    level: 'info',
                    filename: logDir + '/auto-dns.info.log',
                    handleExceptions: true
                })
            ],
            exitOnError: false
        });

        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.colorize(),
                    format
                ),
                handleExceptions: true
            }));
        }


        WinstonImpl._instance = this;
    }

    public static getInstance(): Logger {
        return WinstonImpl._instance;
    }

    public info(message: string): void {
        this.logger.log('info', message);
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

