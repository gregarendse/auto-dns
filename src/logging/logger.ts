import { BunyanImpl } from './bunyan.logger';
// import { ConsoleImpl } from './console.logger';
/**
 * npm install --save winston
 * 
 * Uncomment import and change log to use WinstonImpl
 * 
 * export const log: Logger = WinstonImpl.getInstance();
 */
// import { WinstonImpl } from './winston.logger';

export interface Logger {
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    debug(message: string): void;
}

export const log: Logger = BunyanImpl.getInstance();
