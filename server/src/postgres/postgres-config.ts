import { LedgerEntry } from './ledger-entries/ledger-entry.entity'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { IConfig } from '../interfaces'
import * as fs from 'fs-sync'
import * as path from 'path'

export const config: IConfig = fs.readJSON(path.join(__dirname, '../../.env.json'))

export const postgresConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'p2p',
    password: config.postgresPW,
    database: 'p2p',
    // name: 'p2p',
    // entities: [],
    entities: [LedgerEntry],
    synchronize: true,
    autoLoadEntities: true,
}
