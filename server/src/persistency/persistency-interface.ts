
import { ILedgerEntry, IAuthenticationData, ITask } from '../interfaces'

export interface IPersistencyService {
    getLedgerEntries(): Promise<ILedgerEntry[]>
    saveLedgerEntries(ledgerEntries: ILedgerEntry[]): Promise<void>
    getAuthenticationData(): Promise<IAuthenticationData[]>
    saveAuthenticationData(authenticationData: IAuthenticationData[]): Promise<void>
    getFundedTasks(): Promise<ITask[]>
    saveFundedTasks(fundedTasks: ITask[]): Promise<void>
    getErrors(): Promise<any[]>
    saveErrors(errors): Promise<void>
}
