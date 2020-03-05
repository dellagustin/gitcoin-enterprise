
import { ILedgerEntry, IAuthenticationData, ITask } from '../interfaces'

export interface IPersistencyService {
    getLedgerEntries(): ILedgerEntry[] | Promise<ILedgerEntry[]>
    saveLedgerEntries(ledgerEntries: ILedgerEntry[]): void
    getAuthenticationData(): IAuthenticationData[] | Promise<IAuthenticationData[]>
    saveAuthenticationData(authenticationData: IAuthenticationData[]): void
    getFundedTasks(): ITask[] | Promise<ITask[]>
    saveFundedTasks(fundedTasks: ITask[])
    getErrors(): any[] | Promise<any[]>
    saveErrors(errors): void
}
