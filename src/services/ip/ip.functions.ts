import { IpService } from './ip.interface';
import { IpifyIpServiceImpl } from './Ipify/ip.service.impl';
import { log } from '../../logging';

export function create(type: 'IPIFY'): IpService {
    switch (type) {
        case "IPIFY":
            log.info(`Using IPIFY IP provider`);
            return new IpifyIpServiceImpl();
        default:
            log.warn(`No IP provider specified. Using default, IPIFY`);
            return new IpifyIpServiceImpl();
    }
}
