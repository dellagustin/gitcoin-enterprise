import { Controller, Get, Res, Query } from '@nestjs/common'
import { ImagesService } from './images.service'

@Controller('images') // this is experimental - potentially helpful for avatars
export class ImagesController {

    public constructor(private readonly imagesService: ImagesService) { }

    @Get('/')
    public login(@Query('name') name: string, @Res() res: any): void {
        res.send(this.imagesService.getCompletePath(name))
    }

}
