import { Injectable } from '@nestjs/common'
import * as fs from 'fs-sync'
import * as path from 'path'
import { ILedgerConnector, ILedgerEntry } from './ledger-connector.interface'
import { LoggerService } from '../logger/logger.service'
import { ELogLevel } from '../logger/logger-interface'

@Injectable()
export class LedgerConnector implements ILedgerConnector {
    private ledgerEntriesFileId = path.join(__dirname, '../../operational-data/ledger-entries.json')

    public constructor(private readonly lg: LoggerService) { }
    public saveLedgerEntries(ledgerEntries: ILedgerEntry[]): void {
        return fs.write(this.ledgerEntriesFileId, JSON.stringify(ledgerEntries))
    }

    public getLedgerEntries(login: string): ILedgerEntry[] {

        const entriesWithAddress = this.getLedgerEntriesWithAddress(login)
        if (entriesWithAddress.length === 0) { // add start amount of 200 EIC to Ledger
            const miningEntry: ILedgerEntry = this.getMiningEntryForUser(login)
            const ledgerEntries: ILedgerEntry[] = fs.readJSON(this.ledgerEntriesFileId)
            ledgerEntries.push(miningEntry)
            this.lg.log(ELogLevel.Info, `saving enhanced ledger entries after mining for ${login}`)
            this.saveLedgerEntries(ledgerEntries)
        }

        return fs.readJSON(this.ledgerEntriesFileId)
    }

    // public getBalanceOf(login: string): number {
    //     const entriesWithAddress = this.getLedgerEntriesWithAddress(login)
    //     if (entriesWithAddress.length === 0) { // add start amount of 200 EIC to Ledger
    //         const miningEntry: ILedgerEntry = this.getMiningEntryForUser(login)
    //         const ledgerEntries: ILedgerEntry[] = this.getLedgerEntries()
    //         ledgerEntries.push(miningEntry)
    //         this.lg.log(ELogLevel.Info, `saving enhanced ledger entries after mining for ${login}`)
    //         this.saveLedgerEntries(ledgerEntries)
    //     }

    //     let balance = 0
    //     for (const entry of entriesWithAddress) {
    //         if (entry.sender === login) {
    //             balance = balance - entry.amount
    //         } else if (entry.receiver === login) {
    //             balance = balance + entry.amount
    //         }
    //     }
    //     return balance
    // }

    private getMiningEntryForUser(login: string): ILedgerEntry {
        const entry: ILedgerEntry = {
            id: `tr-${Date.now().toString()}`,
            date: new Date().toISOString(),
            amount: 200,
            sender: 'The Miner',
            receiver: login,
        }
        return entry
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
