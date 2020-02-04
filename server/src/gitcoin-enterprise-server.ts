import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cors from 'cors'
import * as path from 'path'
import * as fs from 'fs-sync'
import * as express from 'express'

export const pathToStaticAssets = path.join(__dirname, '../docs')
export const config = fs.readJSON(path.join(__dirname, '../.env.json'))

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cors('*'));
  // app.use(compression())

  (app as any).useStaticAssets(pathToStaticAssets)
  await app.listen(config.port)

  // if (config.port === '443') {
  //   const httpForwarderAPP = express()

  //   httpForwarderAPP.get('*', (req, res) => {
  //     console.log(req.headers.host)
  //     const saveHost = req.headers.host.replace('http://', 'https://')
  //     res.redirect(saveHost)

  //   })

  //   httpForwarderAPP.listen(80)
  // }

}
bootstrap()
