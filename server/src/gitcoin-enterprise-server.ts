import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cors from 'cors'
import * as path from 'path'
import * as fs from 'fs-sync'
import * as express from 'express'
import { LoggerService } from './logger/logger.service'
import { SupportNotifierService } from './support-notifier/support-notifier.service'
import { ELogLevel } from './logger/logger-interface'
import { PersistencyService } from './persistency/persistency.service'
import { IConfig } from './interfaces'
const compression = require('compression')

export const pathToStaticAssets = path.join(__dirname, '../docs')
export const config: IConfig = fs.readJSON(path.join(__dirname, '../.env.json'))

async function bootstrap() {
  const lg = new LoggerService(new SupportNotifierService(), new PersistencyService())

  let app

  if (config.port !== undefined && config.port === 443) {
    const keyFile = config.certificatePrivateKeyFile
    const certFile = config.certificateFile
    const privateKey = fs.read(keyFile)
    const certificate = fs.read(certFile)
    const credentials = { key: privateKey, cert: certificate }
    app = await NestFactory.create(AppModule, { httpsOptions: credentials })
    await lg.log(ELogLevel.Info, 'starting https server')
    await lg.log(ELogLevel.Info, typeof (app))
  } else {
    app = await NestFactory.create(AppModule)
  }

  app.useStaticAssets(pathToStaticAssets)
  app.use(cors('*'))
  // app.use(compression()) // og:image related stuff causes trouble ...

  app.use(compression({ filter: shouldCompress }))

  function shouldCompress(req, res) {
    if (req.headers['accept-encoding'] === 'deflate, gzip') {
      void lg.log(ELogLevel.Info, 'not compressing this specific request')

      // don't compress responses for link preview - aka og image ...
      return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
  }

  void lg.log(ELogLevel.Info, 'listening soon :)')
  await app.listen(config.port)

  void lg.log(ELogLevel.Info, `app is listening on port: ${config.port}`)

  if (config.port === 443) {
    const unsafePort = 80
    ensureRedirectingFromUnsafeHostToSaveHost(unsafePort)
    void lg.log(ELogLevel.Info, `app is listening on port: ${unsafePort}`)
  }

}
setTimeout(() => {
  void bootstrap()
},         11000)

function ensureRedirectingFromUnsafeHostToSaveHost(unsafePort) {
  const httpForwarderAPPListeningOnUnsafePort = express()

  httpForwarderAPPListeningOnUnsafePort.get('*', (req, res) => {
    res.redirect(config.frontendURL)
  })

  httpForwarderAPPListeningOnUnsafePort.listen(unsafePort)
}
