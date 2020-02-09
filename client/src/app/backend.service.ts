import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { IUser } from './profile/profile.component'
import { backendURL } from '../configurations/configuration'
import { IEmail } from './interfaces'

export interface ITask {
  id: string
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

  public post(url: string, body: any, key: string) {
    // const urlWithClient = `${url}?client=${document.URL}`;
    const urlWithClient = url
    console.log(`calling to post to ${urlWithClient}`)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        companyuserid: key
      })
    }

    console.log(JSON.stringify(body))
    return this.http.post<any>(urlWithClient, JSON.stringify(body), httpOptions)
  }


  public getLedgerEntries() {
    return this.get(`${backendURL}/getLedgerEntries`)
  }

  public sendEMail(eMail: IEmail, key: string): any {
    return this.post(`${backendURL}/sendEMail`, eMail, key)
  }


  public getUser(id: string) {
    return this.get(`${backendURL}/getUser`, id)
  }

  public getFundedTasks() {
    return this.get(`${backendURL}/getFundedTasks`)
  }





}
