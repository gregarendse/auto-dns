import * as fs from 'fs';
import * as path from 'path';

export namespace files {
    export function mkdirPath(dir: string): void {
        if (!fs.existsSync(dir)) {
            try {
                fs.mkdirSync(dir);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    mkdirPath(path.dirname(dir));
                    mkdirPath(dir);
                } else {
                    throw error;
                }
            }
        }
    }
}
