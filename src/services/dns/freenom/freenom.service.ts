import { IpService } from './../../ip';
import * as Freenom from './model';
import * as Config from '../../../model/config/config.model';
import { CLI } from '../cli.interface';
import { AbstractDNSService } from '../abstract.dns.serivce';
import { from, of, combineLatest } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { log } from '../../../logging';

export class FreenomCLIService extends AbstractDNSService implements CLI {

    private readonly _freenom: any;
    private _ipService: IpService;

    constructor(config: string, ipService: IpService, state: string) {
        super(config, state);
        this._freenom = require('freenom-dns').init(this._config.username, this._config.password);
        this._ipService = ipService;
    }

    public update(): void {
        this._ipService.getExternalIp()
            .pipe(
                concatMap((externalIp: string) => {
                    if (this._state.externalIp === externalIp) {
                        log.info(`External IP has not changed, IP: ${externalIp}`);
                        return of(true);
                    } else {
                        return from(this._config.domains)
                            .pipe(
                                concatMap((domain: Config.Domain) => from(domain.records)
                                    .pipe(map((record: Config.Record) => {
                                        const update = { fqdn: record.name + '.' + domain.name, type: record.type, ip: externalIp };
                                        log.info(`Updating record, record: ${JSON.stringify(update)}`);
                                        return update;
                                    }))
                                ),
                                concatMap((updateRequest: { fqdn: string, type: string, ip: string }) => from(
                                    (<Promise<Freenom.UpdateResponse[]>>
                                        this._freenom.dns
                                            .setRecord(updateRequest.fqdn, updateRequest.type, updateRequest.ip)
                                    )
                                )),
                                map((updateResponses: Freenom.UpdateResponse[]) => {
                                    let status: boolean = true;
                                    for (const response of updateResponses) {
                                        if (!response.status) {
                                            log.warn(`Update record failed, status: ${status}, reason: ${response.reason}`);
                                            status = false;
                                        } else {
                                            log.info(`Update record succeeded, statue: ${status}, reason: ${response.reason}`);
                                        }
                                    }
                                    this.persistState({ externalIp: externalIp });
                                    return (status);
                                })
                            );
                    }
                })
            ).subscribe((result: boolean) => {
            }, (error: any) => {
                log.warn(`Record update failed, error: ${JSON.stringify(error)}`);
            });
    }

    public list(): void {
        from(
            (<Promise<Freenom.Domain[]>>this._freenom.dns.listDomains())
        ).pipe(
            concatMap((domains: Freenom.Domain[]) => from(domains)),
            concatMap((domain: Freenom.Domain) => combineLatest(
                of(domain),
                from((<Promise<Freenom.Record[]>>this._freenom.dns.listRecords(domain.name))))
            )
        ).subscribe(([domain, records]) => {
            log.info(`domain: ${JSON.stringify(domain)}, records: ${JSON.stringify(records)}`);
        }, (error: any) => {
            log.warn(`Failed to get domain, record list, error: ${error.message}`)
            log.debug(`${error.name}: ${error.message}`);
        });
    }
}