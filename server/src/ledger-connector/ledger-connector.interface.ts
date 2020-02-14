export interface ILedgerEntry {
    id: string,
    date: string,
    amount: number,
    sender: string
    receiver: string
}

export interface ILedgerConnector {
    getLedgerEntries(login: string): ILedgerEntry[]
    getLedgerEntriesWithAddress(address: string): ILedgerEntry[]
    // getBalanceOf(address: string): number
    saveLedgerEntries(ledgerEntries: ILedgerEntry[]): void
}
