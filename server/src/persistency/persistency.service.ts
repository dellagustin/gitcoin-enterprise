import { Injectable } from '@nestjs/common'
import * as fs from 'fs-sync'
import * as path from 'path'
import { ILedgerEntry } from '../ledger-connector/ledger-connector.interface'
import { ITask, IAuthenticationData } from '../interfaces'
import { ELogLevel } from '../logger/logger-interface'
import { IPersistencyService } from './persistency-interface'

@Injectable()
export class PersistencyService implements IPersistencyService {
    private static numberOfLedgerEntries: number
    private readonly operationalDataPath = path.join(__dirname, '../../operational-data')
    private readonly ledgerEntriesFileId = `${this.operationalDataPath}/ledger-entries.json`
    private readonly authenticationDataFileId = `${this.operationalDataPath}/authentication-data.json`
    private readonly fundedTasksFileId = `${this.operationalDataPath}/funded-tasks.json`
    private readonly errorsFileID = path.join(__dirname, '../errors', 'errors.json')
    private readonly templateOperationalDataPath = path.join(__dirname, '../../operational-data-template')

    public getLedgerEntries(): ILedgerEntry[] {
        let ledgerEntries: ILedgerEntry[]
        try {
            ledgerEntries = fs.readJSON(this.ledgerEntriesFileId)
        } catch (error) {
            fs.copy(this.templateOperationalDataPath, this.operationalDataPath)

            ledgerEntries = fs.readJSON(this.ledgerEntriesFileId)
        }

        PersistencyService.numberOfLedgerEntries = ledgerEntries.length

        return ledgerEntries
    }

    public saveLedgerEntries(ledgerEntries: ILedgerEntry[]): void {
        if (ledgerEntries.length <= PersistencyService.numberOfLedgerEntries) {
            throw new Error('Someone tried to make fun of my ledger :)')
        }

        return fs.write(this.ledgerEntriesFileId, JSON.stringify(ledgerEntries))

    }

    public getAuthenticationData(): IAuthenticationData[] {
        try {
            return fs.readJSON(this.authenticationDataFileId)
        } catch (error) {
            fs.write(this.authenticationDataFileId, '[]')

            return []
        }
    }

    public saveAuthenticationData(authenticationData: IAuthenticationData[]): void {
        return fs.write(this.authenticationDataFileId, JSON.stringify(authenticationData))
    }

    public getFundedTasks(): ITask[] {
        try {
            return fs.readJSON(this.fundedTasksFileId)
        } catch (error) {
            fs.copy(this.templateOperationalDataPath, this.operationalDataPath)

            return fs.readJSON(this.fundedTasksFileId)
        }

    }

    public saveFundedTasks(fundedTasks: ITask[]) {
        fs.write(this.fundedTasksFileId, JSON.stringify(fundedTasks))
    }

    public getErrors(): any[] {
        try {
            return fs.readJSON(this.errorsFileID)
        } catch (error) {
            fs.copy(this.templateOperationalDataPath, this.operationalDataPath)

            return fs.readJSON(this.errorsFileID)
        }
    }

    public saveErrors(errors): void {
        fs.write(this.errorsFileID, JSON.stringify(errors))
    }

}
