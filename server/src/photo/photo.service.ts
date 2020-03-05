import { Injectable, Inject } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Photo } from './photo.entity'

@Injectable()
export class PhotoService {
  public constructor(
    @Inject('PHOTO_REPOSITORY')
    private readonly photoRepository: Repository<Photo>) { }

  public async findAll(): Promise<Photo[]> {
    // tslint:disable-next-line: no-console
    console.log('find something')

    return this.photoRepository.find()
  }
}
