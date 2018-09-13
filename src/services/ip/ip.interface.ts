import { Observable } from 'rxjs';

export interface IpService {
    getExternalIp(): Observable<string>;
}
