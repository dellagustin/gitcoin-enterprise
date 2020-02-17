import { Injectable } from '@nestjs/common'
import * as fs from 'fs-sync'
import * as path from 'path'
import { ILedgerEntry } from '../ledger-connector/ledger-connector.interface'
import { ITask } from '../interfaces'

@Injectable()
export class PersistencyService {
    private operationalDataPath = path.join(__dirname, '../../operational-data')
    private ledgerEntriesFileId = `${this.operationalDataPath}/ledger-entries.json`
    private fundedTasksFileId = `${this.operationalDataPath}/funded-tasks.json`
    private errorsFileID = path.join(__dirname, '../errors', 'errors.json')

    private templateOperationalDataPath = path.join(__dirname, '../../operational-data-template')

    public getLedgerEntries(): ILedgerEntry[] {
        try {
            return fs.readJSON(this.ledgerEntriesFileId)
        } catch (error) {
            fs.copy(this.templateOperationalDataPath, this.operationalDataPath)

            return fs.readJSON(this.ledgerEntriesFileId)
        }
    }

    public saveLedgerEntries(ledgerEntries: ILedgerEntry[]): void {
        return fs.write(this.ledgerEntriesFileId, JSON.stringify(ledgerEntries))
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

    public saveErrors(errors): any[] {
        return fs.write(this.errorsFileID, JSON.stringify(errors))
    }

}