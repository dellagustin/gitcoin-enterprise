import { Injectable } from '@nestjs/common'
import * as fs from 'fs-sync'
import * as path from 'path'
import { ILedgerConnector, ILedgerEntry } from './ledger-connector.interface'

@Injectable()
export class LedgerConnector implements ILedgerConnector {
    private ledgerEntriesFileId = path.join(__dirname, '../../operational-data/ledger-entries.json')

    public saveLedgerEntries(ledgerEntries: ILedgerEntry[]): void {
        return fs.write(this.ledgerEntriesFileId, JSON.stringify(ledgerEntries))
    }

    public getLedgerEntries(): ILedgerEntry[] {

        return fs.readJSON(this.ledgerEntriesFileId)
    }

}
