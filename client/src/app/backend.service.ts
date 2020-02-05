import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { IUser } from './profile/profile.component'
import { ILedgerEntry } from './ledger/ledger.interface'
import { backendURL } from '../configurations/configuration'

export interface ITask {
  taskType: ETaskType
  name: string
  description: string
  funding: number
  currency: string
  status: ETaskStatus
  funderRatedWith: number
  solutionProviderRatedWith: number
}

export enum ETaskStatus {
  'created' = 1,
  'inProgress' = 2,
  'completed' = 3,
  'paid' = 4
}

export enum ETaskType {
  'GitHubIssue' = 1,
  'tbd...' = 2,
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  public static currentUser: IUser = BackendService.getInitialUser()

  public constructor(private readonly http: HttpClient) { }

  public static getInitialTask(): ITask {
    return {
      taskType: ETaskType.GitHubIssue,
      name: '',
      description: '',
      funding: 0,
      currency: 'EIC',
      status: ETaskStatus.created,
      funderRatedWith: 5,
      solutionProviderRatedWith: 5
    }
  }

  public static getInitialUser() {
    const user: IUser = {
      companyId: '',
      firstName: '',
      balance: 0,
    }

    return user
  }

  public get(url: any): any {
    console.log(`calling to get ${url}`)
    return this.http.get<any>(url)
  }

  public post(url: string, body: any) {
    // const urlWithClient = `${url}?client=${document.URL}`;
    const urlWithClient = url
    console.log(`calling to post to ${urlWithClient}`)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    console.log(JSON.stringify(body))
    return this.http.post<any>(urlWithClient, JSON.stringify(body), httpOptions)
  }

  public getLedgerEntries() {
    return this.get(`${backendURL}/getLedgerEntries`)
  }

  public getFundedTasks(): ITask[] {
    const fundedTasks: ITask[] = []
    const task1 = this.getDefaultTaskForDemo()
    task1.funding = 1000
    fundedTasks.push(task1)

    const task2 = this.getDefaultTaskForDemo()
    task2.name = 'Another fancy task'
    task2.funding = 2000
    fundedTasks.push(task2)

    const task3 = this.getDefaultTaskForDemo()
    task2.name = 'Yet another fancy task'
    task2.funding = 3000
    fundedTasks.push(task2)

    return fundedTasks
  }

  public getUser(companyId: string) {
    return this.getUsers().filter((entry: IUser) => entry.companyId === companyId)[0]
  }

  public getDefaultTaskForDemo() {
    return {
      taskType: ETaskType.GitHubIssue,
      name: 'Just a Demo Task',
      description: 'Just a Demo Description',
      funding: 0,
      currency: 'EIC',
      status: ETaskStatus.created,
      funderRatedWith: 5,
      solutionProviderRatedWith: 5
    }

  }

  public getUsers() {
    const users: IUser[] = []

    const lisa: IUser = {
      balance: 1000,
      companyId: 'd123',
      firstName: 'Lisa',
    }
    users.push(lisa)

    const laura: IUser = {
      balance: 2000,
      companyId: 'd124',
      firstName: 'Laura',
    }
    users.push(laura)


    const luisa: IUser = {
      balance: 3000,
      companyId: 'd125',
      firstName: 'Luisa',
    }

    users.push(luisa)

    return users
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
