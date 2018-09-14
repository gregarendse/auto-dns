import { CLI, FreenomCLIService } from './services/dns';
import { create } from './services/ip';
import { List, Update, Action } from './services/action';
import { Command } from 'commander';
import { log } from './logging';

log.info('Auto DNS started');

const command = new Command();
const actions: Action[] = [];

command
    .version('0.0.0')
    .usage('<command> [options]')
    .option('-c, --config <config>', 'Config file location', '/etc/auto-dns/config.json')
    .option('-l, --list', 'List DNS entries', () => {
        actions.push(new List());
    })
    .option('-u, --update', 'Add/Edit DNS records', () => {
        actions.push(new Update());
    })
    .option('-i, --ip-service <ip-service>', 'Specifiy the IP service used to get external IP [ipify]', 'ipify')
    .option('-s, --state <state>', 'Location of state file', '/tmp/auto-dns/state.json')

command
    .command('freenom')
    .description('Use Freenom DNS')
    .action(() => {
        const service: CLI = new FreenomCLIService(command['config'], create(command['ip-service']), command['state']);
        for (const action of actions) {
            action.execute(service);
        }
    });

if (!process.argv.slice(2).length) {
    command.outputHelp();
    process.exit(1);
}

command.parse(process.argv);
