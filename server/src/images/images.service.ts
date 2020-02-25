import { Injectable } from '@nestjs/common'
import * as path from 'path'
@Injectable()
export class ImagesService {
    public getCompletePath(name: string): string {
        return path.join(path.resolve(''), `../../images/${name}`)
    }
}
