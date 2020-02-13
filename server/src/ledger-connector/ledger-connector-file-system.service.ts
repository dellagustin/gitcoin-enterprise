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

    public getBalanceOf(address: string): number {
        const entriesWithAddress = this.getLedgerEntriesWithAddress(address)
        if (entriesWithAddress.length === 0) {
            throw new Error('No transactions with this address in Ledger')
        }
        let balance = 0
        for (const entry of entriesWithAddress) {
            if (entry.sender === address) {
                balance = balance - entry.amount
            } else if (entry.receiver === address) {
                balance = balance + entry.amount
            }
        }
        return balance
    }

    public getLedgerEntriesWithAddress(address: string): ILedgerEntry[] {

        return fs.readJSON(this.ledgerEntriesFileId).filter((ledgerEntry: ILedgerEntry) => {
            if (ledgerEntry.sender === address || ledgerEntry.receiver === address) {
                return true
            } else {
                return false
            }
        })
    }
}
