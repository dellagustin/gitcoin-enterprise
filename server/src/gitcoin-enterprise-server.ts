import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cors from 'cors'
import * as path from 'path'
import * as fs from 'fs-sync'
import * as express from 'express'
import { LoggerService, ELogLevel } from './logger/logger.service'

export const pathToStaticAssets = path.join(__dirname, '../docs')
export const config = fs.readJSON(path.join(__dirname, '../.env.json'))

async function bootstrap() {
  const logger = new LoggerService()
  const app = await NestFactory.create(AppModule)
  app.use(cors('*'));
  // app.use(compression())

  (app as any).useStaticAssets(pathToStaticAssets)
  await app.listen(config.port)
  logger.log(ELogLevel.Info, `app is listening on port: ${config.port}`)

  if (config.port === '443') {
    const httpForwarderAPP = express()

    httpForwarderAPP.get('*', (req, res) => {
      logger.log(ELogLevel.Info, `forwarding an http requst to https`)
      const saveHost = req.headers.host.replace('http://', 'https://')
      res.redirect(saveHost)

    })

    httpForwarderAPP.listen(80)
  }

}
bootstrap()
