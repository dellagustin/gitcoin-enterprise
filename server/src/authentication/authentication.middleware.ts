import { NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import { config } from '../app.module'
const axios = require('axios')

export class AuthenticationMiddleware implements NestMiddleware {
  // tslint:disable-next-line: ban-types
  async use(req: Request, res: Response, next: Function) {

    // await axios.get(`${config.backendService}/login`)
    next()
  }
}
