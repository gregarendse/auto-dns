import { CLI } from '../dns/cli.interface';

export interface Action {
    execute(service: CLI): void;
}
