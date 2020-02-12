import { Injectable, OnInit } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { backendURL } from '../configurations/configuration'
import { IEmail, IAuthenticationData } from './interfaces'

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
  public authenticationData: IAuthenticationData

  public actionsForRedirectingConvenientlyAfterLogin
  private authenticationToken

  public constructor(private readonly http: HttpClient) {
    try {
      this.authenticationToken = document.getElementById('authenticationToken').innerHTML.trim()
      this.actionsForRedirectingConvenientlyAfterLogin = document.getElementById('actionID').innerHTML.trim()
    } catch (error) {
      console.log(error.message)
    }

    if (this.authenticationToken !== 'authenticationTokenContent') {
      this.getAuthenticationData() // this will only work if header can be set to the replacement of authenticationTokenContent
        .subscribe((authenticationData) => this.authenticationData = authenticationData)
    }

  }

  public get(url: any): any {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        michaelsfriendskey: this.authenticationToken
      })
    }
    console.log(`calling to get ${url}`)
    return this.http.get<any>(url, options)
  }


  public post(url: string, body: any) {
    // const urlWithClient = `${url}?client=${document.URL}`;
    const urlWithClient = url
    console.log(`calling to post to ${urlWithClient}`)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        michaelsfriendskey: this.authenticationToken
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


  public getUser() {
    return this.get(`${backendURL}/getUser`)
  }

  public getFundedTasks() {
    return this.get(`${backendURL}/getFundedTasks`)
  }

  public getAuthenticationData() {
    return this.get(`${backendURL}/getAuthenticationData`)
  }




}
