import { IpService } from '../ip.interface';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import axios, { AxiosResponse } from 'axios';

export class IpifyIpServiceImpl implements IpService {

    private readonly _url: string = 'https://api.ipify.org?format=json';

    public getExternalIp(): Observable<string> {
        return from(axios.get<{ ip: string }>(this._url))
            .pipe(
                map((response: AxiosResponse<{ ip: string }>) => response.data.ip)
            );

    }
}