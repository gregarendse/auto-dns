import { CLI } from '../dns/cli.interface';
import { Action } from './action.interface';

export class List implements Action {
    public execute(service: CLI) {
        service.list();
    }
}
