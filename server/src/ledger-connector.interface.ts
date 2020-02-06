export interface ILedgerEntry {
    id: string,
    date: string,
    amount: number,
    sender: string
    receiver: string
}

export interface ILedgerConnector {
    getLedgerEntries(): ILedgerEntry[]
    saveLedgerEntries(ledgerEntries: ILedgerEntry[]): void
}
