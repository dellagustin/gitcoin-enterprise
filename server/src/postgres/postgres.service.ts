import { Injectable } from '@nestjs/common'
import { IPersistencyService } from '../persistency/persistency-interface'
import { ILedgerEntry, IAuthenticationData, ITask } from '../interfaces'
import { LedgerEntriesService } from './ledger-entries/ledger-entries.service'
import { AuthenticationEntryService } from './authentication-entry/authentication-entry.service'
import { TaskService } from './task/task.service'

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
export class PostgresService implements IPersistencyService {

    private readonly client

    public constructor(private readonly lS: LedgerEntriesService,
                       private readonly aS: AuthenticationEntryService,
                       private readonly tS: TaskService) {

        setTimeout(async () => {
            await this.lS.removeAll()
            await this.aS.removeAll()
            await this.tS.removeAll()

        },         2000)
    }

    public async  getLedgerEntries(): Promise<ILedgerEntry[]> {

        return this.lS.findAll()
    }

    public async saveLedgerEntries(ledgerEntries: ILedgerEntry[]): Promise<void> {
        try {
            await this.lS.create(ledgerEntries[ledgerEntries.length - 1])
        } catch (error) {
            // console.log(`shit happened: ${error.message}`)
        }
    }
    public async getAuthenticationData(): Promise<any[]> {
        return this.aS.findAll()
    }

    public async saveAuthenticationData(authenticationData: IAuthenticationData[]) {
        await this.aS.create(authenticationData[authenticationData.length - 1])
    }
    public async getFundedTasks(): Promise<ITask[]> {

        return this.tS.findAll()
    }

    public async saveFundedTasks(fundedTasks: ITask[]) {
        console.log(`saving funded task: ${JSON.stringify(fundedTasks)}`)
        await this.tS.create(fundedTasks[fundedTasks.length - 1])
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

    // private async initializePostgres() {
    //     try {
    //         await this.client.query(statementDropTableLedger)
    //         await this.client.query(statementDropTableAuthenticationData)
    //         await this.client.query(statementDropTableTaks)

    //     } catch (error) {
    //         // console.log(`error during dropping tables: ${error.message}`)
    //     }
    //     try {
    //         await this.client.query(statementCreateLedgerTable)
    //         await this.client.query(statementCreateAuthenticationDataTable)
    //         await this.client.query(statementCreateTasksTable)
    //     } catch (error) {
    //         // console.log(`error during creating tables: ${error.message}`)
    //     }
    // }

    // private async connectToPostgres(initialize?: boolean) {
    //     this.client = new Client({
    //         user: 'p2p',
    //         database: 'p2p',
    //         password: 'mysecretpassword',
    //     })

    //     try {
    //         await this.client.connect()
    //         // tslint:disable-next-line: no-console
    //         console.log('connection successful')
    //     } catch (error) {
    //         // tslint:disable-next-line: no-console
    //         console.log(`error during connecting to postgres: ${error.message}`)
    //     }
    // }

}

        // const res = await this.client.query('SELECT $1::text as message', ['Hello world!'])
        // console.log(res.rows[0].message) // Hello world!
        // await this.client.end()
