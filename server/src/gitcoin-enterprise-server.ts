import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cors from 'cors'
import * as path from 'path'
import * as fs from 'fs-sync'
import * as express from 'express'
import { LoggerService, ELogLevel } from './logger/logger.service'
const compression = require('compression')

export const pathToStaticAssets = path.join(__dirname, '../docs')
export const config = fs.readJSON(path.join(__dirname, '../.env.json'))

async function bootstrap() {
  const logger = new LoggerService()

  let app

  if (config.port.indexOf('443') !== -1) {

    const keyFile = config.certificatePrivateKeyFile
    const certFile = config.certificateFile
    const privateKey = fs.read(keyFile)
    const certificate = fs.read(certFile)
    const credentials = { key: privateKey, cert: certificate }
    app = await NestFactory.create(AppModule, { httpsOptions: credentials })
    logger.log(ELogLevel.Info, 'starting https server')
    logger.log(ELogLevel.Info, typeof(app))

  } else {
    app = await NestFactory.create(AppModule)
  }

  app.useStaticAssets(pathToStaticAssets)
  app.use(cors('*'))
  app.use(compression())

  await app.listen(config.port)

  logger.log(ELogLevel.Info, `app is listening on port: ${config.port}`)

  if (config.port === '443') {
    const httpForwarderAPP = express()

    httpForwarderAPP.get('*', (req, res) => {
      logger.log(ELogLevel.Info, `forwarding an http request to https`)
      if (req.headers.host.indexOf('http://') !== -1) {
        const saveHost = req.headers.host.replace('http://', 'https://')
        logger.log(ELogLevel.Info, saveHost)
        res.redirect(saveHost)
      }

    })

    httpForwarderAPP.listen(80)
  }

}
bootstrap()
