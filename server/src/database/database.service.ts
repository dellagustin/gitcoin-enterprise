import { Injectable } from '@nestjs/common'
import { IPersistencyService } from '../persistency/persistency-interface'
import { ILedgerEntry, IAuthenticationData, ITask } from '../interfaces'
import { resolve } from 'dns'

@Injectable()
export class DatabaseService implements IPersistencyService {

    public async  getLedgerEntries(): Promise<ILedgerEntry[]> {
        return Promise.resolve([])
        // tbd
    }

    public async saveLedgerEntries(ledgerEntries: ILedgerEntry[]): Promise<void> {
        await Promise.resolve([])
        // tbd
    }

    public async getAuthenticationData(): Promise<IAuthenticationData[]> {
        return Promise.resolve([])
    }

    public saveAuthenticationData(authenticationData: IAuthenticationData[]): void {
        // tbd
    }

    public async getFundedTasks(): Promise<ITask[]> {
        return Promise.resolve([])
    }

    public saveFundedTasks(fundedTasks: ITask[]): void {
        // tbd
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
}
