import { Injectable } from '@nestjs/common'
import { IPersistencyService } from './persistency-interface'
import { ILedgerEntry, IAuthenticationData, ITask } from '../interfaces'
import { PersistencyService } from './persistency.service'
import { LoggerService } from '../logger/logger.service'
import { ELogLevel } from '../logger/logger-interface'
const { Client } = require('pg')
import { createConnection } from 'typeorm'

const statementDropTableLedger = 'DROP TABLE ledger'
const statementDropTableTaks = 'DROP TABLE tasks'
const statementDropTableAuthenticationData = 'DROP TABLE authenticationdata'

const statementCreateLedgerTable = 'CREATE TABLE ledger (id VARCHAR(255), date VARCHAR(255), amount VARCHAR(255), sender VARCHAR(255), receiver VARCHAR(255))'
const statementCreateTasksTable = 'CREATE TABLE tasks (link VARCHAR(255), title VARCHAR(255), description VARCHAR(255), funding INT, status VARCHAR(255))'
const statementCreateAuthenticationDataTable = 'CREATE TABLE authenticationdata (id VARCHAR(255) PRIMARY KEY, avatarURL VARCHAR(255), login VARCHAR(255), p2pAccessToken VARCHAR(255))'

const statementInsertTableLedger = `INSERT INTO ledger (id, date, amount, sender, receiver) VALUES ('p2pidp2p', 'p2pdatep2p', 'p2pamountp2p', 'p2psenderp2p','p2preceiverp2p')`
const statementInsertTableTaks = `INSERT INTO tasks (link, title, description, funding, status) VALUES ('aaaaalinkbbbbb', 'aaaaatitlebbbbb', 'aaaaadescriptionbbbbb', 'aaaaafundingbbbbb', 'aaaaastatusbbbbb')`
const statementInsertTableAuthenticationData = `INSERT INTO authenticationdata (id, avatarURL, p2pAccessToken) VALUES ('aaaaaidbbbbb', 'aaaaaavatarURLbbbbb', 'aaaaap2pAccessTokenbbbbb')`

const statementSelectTableLedger = 'SELECT * FROM ledger'
const statementSelectTableTaks = 'SELECT * FROM tasks'
const statementSelectTableAuthenticationData = 'SELECT * FROM authenticationdata'

// con.query("SELECT * FROM customers WHERE address = 'Park Lane 38'", function (err, result) {
// var sql = "DELETE FROM customers WHERE address = 'Mountain 21'";
// var sql = "UPDATE customers SET address = 'Canyon 123' WHERE address = 'Valley 345'";

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async () => createConnection({
            type: 'mysql',
            host: 'localhost',
            port: 5432,
            username: 'root',
            password: 'root',
            database: 'test',
            entities: [
                // tslint:disable-next-line: prefer-template
                __dirname + '/../**/*.entity{.ts,.js}',
            ],
            synchronize: true,
        }),
    },
]

@Injectable()
export class PostgresService implements IPersistencyService {

    private client

    public constructor(private readonly lg: LoggerService) {
        void this.lg.log(ELogLevel.Error, `I am in the constructor`)
        // void this.lg.log(ELogLevel.Error, `should not be reached with current config`)
        void this.connectToPostgres()
        void this.initializePostgres()
        setTimeout(() => {
            void this.saveLedgerEntries([])
        },         2000)
        setTimeout(async () => {
            const entries = await this.getLedgerEntries()
            // tslint:disable-next-line: no-console
            console.log(JSON.stringify(entries))
        },         4000)
    }

    public async  getLedgerEntries(): Promise<ILedgerEntry[]> {
        await this.lg.log(ELogLevel.Info, `read the following ledger entries: ${JSON.stringify([])}`)
        const ledgerEntries = (await this.client.query(statementSelectTableLedger)).rows

        return ledgerEntries
    }

    public async saveLedgerEntries(ledgerEntries: ILedgerEntry[]): Promise<void> {
        try {
            await this.client.query(statementInsertTableLedger)
        } catch (error) {
            // console.log(`shit happened: ${error.message}`)
        }
    }
    public async getAuthenticationData(): Promise<IAuthenticationData[]> {
        return (await this.client.query(statementSelectTableAuthenticationData)).rows
    }
    public saveAuthenticationData(authenticationData: IAuthenticationData[]): void {
        this.client.query(statementInsertTableAuthenticationData)
    }
    public async getFundedTasks(): Promise<ITask[]> {
        return (await this.client.query(statementSelectTableTaks)).rows
    }

    public saveFundedTasks(fundedTasks: ITask[]): void {
        this.client.query(statementInsertTableTaks)
    }

    public getErrors(): any[] {
        return []
    }

    public saveErrors(errors): void {
        // tbd
    }

    public async addMiningEntryForUser(login: string): Promise<ILedgerEntry> {
        const entry: ILedgerEntry = {
            id: `tr-${Date.now().toString()}`,
            date: new Date().toISOString(),
            amount: 200,
            sender: 'The Miner',
            receiver: login,
        }
        const content = await this.getLedgerEntries()
        content.push(entry)
        await this.saveLedgerEntries(content)

        return entry
    }

    private async initializePostgres() {
        try {
            await this.client.query(statementDropTableLedger)
            await this.client.query(statementDropTableAuthenticationData)
            await this.client.query(statementDropTableTaks)

        } catch (error) {
            // console.log(`error during dropping tables: ${error.message}`)
        }
        try {
            await this.client.query(statementCreateLedgerTable)
            await this.client.query(statementCreateAuthenticationDataTable)
            await this.client.query(statementCreateTasksTable)
        } catch (error) {
            // console.log(`error during creating tables: ${error.message}`)
        }
    }

    private async connectToPostgres(initialize?: boolean) {
        this.client = new Client({
            user: 'p2p',
            database: 'p2p',
            password: 'mysecretpassword',
        })

        try {
            await this.client.connect()
            // tslint:disable-next-line: no-console
            console.log('connection successful')
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(`error during connecting to postgres: ${error.message}`)
        }
    }

}

        // const res = await this.client.query('SELECT $1::text as message', ['Hello world!'])
        // console.log(res.rows[0].message) // Hello world!
        // await this.client.end()
