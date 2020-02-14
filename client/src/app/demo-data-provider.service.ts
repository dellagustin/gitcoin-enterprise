import { Injectable } from '@angular/core'
import { ETaskStatus } from './backend.service'
import { ILedgerEntry } from './ledger/ledger.interface'
import { ETaskType, ITask } from './interfaces'

@Injectable({
  providedIn: 'root'
})
export class DemoDataProviderService {

  public getFundedTasks(): ITask[] {
    const fundedTasks: ITask[] = []
    const task1 = this.getDefaultTaskForDemo()
    task1.funding = 1000
    fundedTasks.push(task1)

    const task2 = this.getDefaultTaskForDemo()
    task2.title = 'Another fancy task'
    task2.funding = 2000
    fundedTasks.push(task2)

    const task3 = this.getDefaultTaskForDemo()
    task3.title = 'A very difficult task'
    task3.funding = 10000
    fundedTasks.push(task3)

    return fundedTasks
  }

  public getDefaultTaskForDemo(): ITask {
    return {
      link: 'https://github.com/gitcoin-enterprise/gitcoin-enterprise/issues/16',
      taskType: ETaskType.GitHubIssue,
      title: 'Just a Demo Task',
      description: 'Just a Demo Description',
      funding: 0,
      status: ETaskStatus.created,
      funderRatedWith: 5,
      solutionProviderRatedWith: 5,
      dueDate: '2020-01-08'
    }

  }

  public getDefaultLedgerEntriesForDemo(): ILedgerEntry[] {
    const ledgerEntries: ILedgerEntry[] = []
    const entry1: ILedgerEntry = {
      id: '4711',
      date: '2020-01-01',
      amount: 100,
      sender: 'Hugo',
      receiver: 'Fritz',
    }

    ledgerEntries.push(entry1)

    const entry2: ILedgerEntry = {
      id: '4712',
      date: '2020-01-02',
      amount: 200,
      sender: 'Laura',
      receiver: 'Luisa',
    }

    ledgerEntries.push(entry2)

    const entry3: ILedgerEntry = {
      id: '4713',
      date: '2020-01-01',
      amount: 100,
      sender: 'Alex',
      receiver: 'Sascha-Michelle',
    }

    ledgerEntries.push(entry3)

    return ledgerEntries
  }


}
