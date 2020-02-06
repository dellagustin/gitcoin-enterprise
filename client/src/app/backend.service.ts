import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { IUser } from './profile/profile.component'
import { ILedgerEntry } from './ledger/ledger.interface'
import { backendURL } from '../configurations/configuration'
import { IEmail } from './email/email.component'

export interface ITask {
  taskType: ETaskType
  name: string
  description: string
  funding: number
  currency: string
  status: ETaskStatus
  funderRatedWith: number
  solutionProviderRatedWith: number
  link: string
  dueDate: string
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

  public constructor(private readonly http: HttpClient) { }

  public get(url: any, key?: string): any {

    if (key !== undefined) {

      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          companyuserid: key
        })
      }
      console.log(`calling to get ${url}`)
      return this.http.get<any>(url, options)
    }

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

  public sendEMail(eMail: IEmail): any {
    return this.post(`${backendURL}/sendEMail`, eMail)
  }


  public getUser(companyId: string) {
    return this.get(`${backendURL}/getUser`, companyId)
  }

  public getFundedTasks() {
    return this.get(`${backendURL}/getFundedTasks`)
  }


  public getUsers() {
    const users: IUser[] = []

    const michael: IUser = {
      balance: 1000,
      companyId: 'd123',
      firstName: 'Michael',
      link: 'https://github.com/michael-spengler',
    }
    users.push(michael)

    const akshay: IUser = {
      balance: 2000,
      companyId: 'd124',
      firstName: 'Akshay',
      link: 'https://github.com/ibakshay',
    }
    users.push(akshay)


    const fabian: IUser = {
      balance: 3000,
      companyId: 'd125',
      firstName: 'Fabian',
      link: 'https://github.com/fabianriewe'
    }

    users.push(fabian)

    return users
  }


}
