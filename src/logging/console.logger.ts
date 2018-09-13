import { Logger } from './logger';

export class ConsoleImpl implements Logger {
    private static _instance: Logger = new ConsoleImpl();

    constructor() {
    }

    public static getInstance(): Logger {
        return ConsoleImpl._instance;
    }

    public info(message: string): void {
        console.log(message);
    }

    public warn(message: string): void {
        console.warn(message);
    }

    public error(message: string): void {
        console.error(message);
    }

    public debug(message: string): void {
        console.debug(message);
    }
}
