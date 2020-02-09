import { Injectable } from '@nestjs/common'
import { ILedgerConnector, ILedgerEntry } from './ledger-connector.interface'

@Injectable()
export class EthereumLedgerConnector implements ILedgerConnector {

    public saveLedgerEntries(ledgerEntries: ILedgerEntry[]): void {
        // tbd
    }

    public getLedgerEntries(): ILedgerEntry[] {
        // tbd
        return []
    }

}
