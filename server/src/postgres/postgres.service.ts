import { Injectable } from '@nestjs/common'
import { IPersistencyService } from '../persistency/persistency-interface'
import { ILedgerEntry, IAuthenticationData, ITask } from '../interfaces'

import { LoggerService } from '../logger/logger.service'
import { ELogLevel } from '../logger/logger-interface'

// const statementInsertTableLedger = `INSERT INTO ledger (id, date, amount, sender, receiver) VALUES ('p2pidp2p', 'p2pdatep2p', 'p2pamountp2p', 'p2psenderp2p','p2preceiverp2p')`
// const statementInsertTableTaks = `INSERT INTO tasks (link, title, description, funding, status) VALUES ('aaaaalinkbbbbb', 'aaaaatitlebbbbb', 'aaaaadescriptionbbbbb', 'aaaaafundingbbbbb', 'aaaaastatusbbbbb')`
// const statementInsertTableAuthenticationData = `INSERT INTO authenticationdata (id, avatarURL, p2pAccessToken) VALUES ('aaaaaidbbbbb', 'aaaaaavatarURLbbbbb', 'aaaaap2pAccessTokenbbbbb')`

// const statementSelectTableLedger = 'SELECT * FROM ledger'
// const statementSelectTableTaks = 'SELECT * FROM tasks'
// const statementSelectTableAuthenticationData = 'SELECT * FROM authenticationdata'

// con.query("SELECT * FROM customers WHERE address = 'Park Lane 38'", function (err, result) {
// var sql = "DELETE FROM customers WHERE address = 'Mountain 21'";
// var sql = "UPDATE customers SET address = 'Canyon 123' WHERE address = 'Valley 345'";

@Injectable()
export class PostgresService {

    // private client

    // public constructor(private readonly lg: LoggerService) {}

    // public async  getLedgerEntries(): Promise<ILedgerEntry[]> {

    //     return ledgerEntries
    // }

    // public async saveLedgerEntries(ledgerEntries: ILedgerEntry[]): Promise<void> {
    //     try {
    //         await this.client.query(statementInsertTableLedger)
    //     } catch (error) {
    //         // console.log(`shit happened: ${error.message}`)
    //     }
    // }
    // public async getAuthenticationData(): Promise<IAuthenticationData[]> {
    //     return (await this.client.query(statementSelectTableAuthenticationData)).rows
    // }
    // public saveAuthenticationData(authenticationData: IAuthenticationData[]): void {
    //     this.client.query(statementInsertTableAuthenticationData)
    // }
    // public async getFundedTasks(): Promise<ITask[]> {
    //     return (await this.client.query(statementSelectTableTaks)).rows
    // }

    // public saveFundedTasks(fundedTasks: ITask[]): void {
    //     this.client.query(statementInsertTableTaks)
    // }

    // public getErrors(): any[] {
    //     return []
    // }

    // public saveErrors(errors): void {
    //     // tbd
    // }

    // public async addMiningEntryForUser(login: string): Promise<ILedgerEntry> {
    //     const entry: ILedgerEntry = {
    //         id: `tr-${Date.now().toString()}`,
    //         date: new Date().toISOString(),
    //         amount: 200,
    //         sender: 'The Miner',
    //         receiver: login,
    //     }
    //     const content = await this.getLedgerEntries()
    //     content.push(entry)
    //     await this.saveLedgerEntries(content)

    //     return entry
    // }

    // // private async initializePostgres() {
    // //     try {
    // //         await this.client.query(statementDropTableLedger)
    // //         await this.client.query(statementDropTableAuthenticationData)
    // //         await this.client.query(statementDropTableTaks)

    // //     } catch (error) {
    // //         // console.log(`error during dropping tables: ${error.message}`)
    // //     }
    // //     try {
    // //         await this.client.query(statementCreateLedgerTable)
    // //         await this.client.query(statementCreateAuthenticationDataTable)
    // //         await this.client.query(statementCreateTasksTable)
    // //     } catch (error) {
    // //         // console.log(`error during creating tables: ${error.message}`)
    // //     }
    // // }

    // // private async connectToPostgres(initialize?: boolean) {
    // //     this.client = new Client({
    // //         user: 'p2p',
    // //         database: 'p2p',
    // //         password: 'mysecretpassword',
    // //     })

    // //     try {
    // //         await this.client.connect()
    // //         // tslint:disable-next-line: no-console
    // //         console.log('connection successful')
    // //     } catch (error) {
    // //         // tslint:disable-next-line: no-console
    // //         console.log(`error during connecting to postgres: ${error.message}`)
    // //     }
    // // }

}

        // const res = await this.client.query('SELECT $1::text as message', ['Hello world!'])
        // console.log(res.rows[0].message) // Hello world!
        // await this.client.end()
