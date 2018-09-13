import { Config } from '../../model/config/config.model';
import { CLI } from './cli.interface';
import { log } from '../../logging';
import * as fs from 'fs';
import * as path from 'path';
import { files } from '../../utils/file.util';

export abstract class AbstractDNSService implements CLI {
    protected _config: Config;
    protected _state: { externalIp: string };
    private _statFile: string;

    constructor(configFile: string, stateFile: string) {
        this._statFile = stateFile;

        try {
            const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
            this._config = new Config(config['username'], config['password'], config['domains']);
            log.info(`loading config from file, file: ${configFile}`);
        } catch (error) {
            log.error(`Unable to load config from file, file: ${configFile}`);
            throw error;
        }

        try {
            if (!fs.existsSync(stateFile)) {
                files.mkdirPath(path.dirname(stateFile));
                log.info(`State file does not exist. Creating initial state file, file: ${stateFile}`);
                fs.writeFileSync(stateFile, JSON.stringify({ externalIp: null }), { encoding: 'utf8', flag: 'w' });
            }

            const state: { externalIp: string } = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
            this._state = state;
            log.info(`loading state from file, file: ${stateFile}`);
        } catch (error) {
            log.warn(`Unable to read state from state file, file: ${stateFile}`);
            log.info(`Running in stateless mode`);
            this._state = { externalIp: 'localhost' };
            log.debug(`${error.name}: ${error.message}`);
        }
    }

    protected persistState(state: { externalIp: string }): void {
        try {
            fs.writeFileSync(this._statFile, JSON.stringify(state), { encoding: 'utf8', flag: 'w' });
            log.info(`Saving state to file, file: ${this._statFile}`);
        } catch (error) {
            log.warn(`Unable to save state to file, file: ${this._statFile}, error: ${error.code}`)
            log.debug(`${error.name}: ${error.message}`);
        }
    }

    public abstract update(): void;
    public abstract list(): void;
}
