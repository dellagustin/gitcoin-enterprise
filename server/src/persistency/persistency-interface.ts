
import { ILedgerEntry, IAuthenticationData, ITask } from '../interfaces'

export interface IPersistencyService {
    getLedgerEntries(): Promise<ILedgerEntry[]>
    saveLedgerEntries(ledgerEntries: ILedgerEntry[]): void
    getAuthenticationData(): Promise<IAuthenticationData[]>
    saveAuthenticationData(authenticationData: IAuthenticationData[]): void
    getFundedTasks(): Promise<ITask[]>
    saveFundedTasks(fundedTasks: ITask[])
    getErrors(): any[] | Promise<any[]>
    saveErrors(errors): void
}
