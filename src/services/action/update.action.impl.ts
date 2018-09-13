import { CLI } from '../dns/cli.interface';
import { Action } from './action.interface';

export class Update implements Action {
    public execute(service: CLI) {
        service.update();
    }
}
