import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { backendURL } from '../configurations/configuration'
import { IEmail, IApplication, ITaskAndFunding, IBountyReceiver } from './interfaces'
import { ILedgerEntry } from './ledger/ledger.interface'

export enum ETaskStatus {
  'created' = 1,
  'inProgress' = 2,
  'completed' = 3,
  'paid' = 4,
}

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  public static gitHubURL

  public constructor(private readonly http: HttpClient) {
  }

  public getLedgerEntries(token: string) {
    return this.get(`${backendURL}/getLedgerEntries`, token)
  }

  public postTransfer(receivers: IBountyReceiver[], token: string) {
    return this.post(`${backendURL}/postTransfer`, receivers, token)
  }

  // public sendEMail(eMail: IEmail, token: string): any {
  //   return this.post(`${backendURL}/sendEMail`, eMail, token)
  // }

  public postSolutionApproach(application: IApplication, token: string): any {
    return this.post(`${backendURL}/postSolutionApproach`, application, token)
  }

  public triggerBackup(token: string) {
    return this.post(`${backendURL}/triggerBackup`, {}, token)
  }

  public saveFunding(taskAndFunding: ITaskAndFunding, token: string) {
    return this.post(`${backendURL}/postFunding`, taskAndFunding, token)
  }

  public getUser(token: string) {
    return this.get(`${backendURL}/getUser`, token)
  }

  public getFundedTasks(token: string) {
    return this.get(`${backendURL}/getFundedTasks`, token)
  }

  public getAuthenticationData(token: string) {
    return this.get(`${backendURL}/getAuthenticationData`, token)
  }

  public getIssueInfo(link: string, token: string) {
    return this.get(`${backendURL}/getIssueInfo/link/${link}`, token)
  }

  private get(url: any, token: string): any {
    this.validateToken(token)
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'michaelsfriendskey': token,
      }),
    }
    // console.log(`calling to get ${url}`)

    return this.http.get<any>(url, options)
  }

  private validateToken(token: string) {
    if (token === null || token === undefined) {
      alert(`Invalid Token: ${token}`)
    }
  }

  private post(url: string, body: any, token: string) {
    // const urlWithClient = `${url}?client=${document.URL}`;
    this.validateToken(token)
    const urlWithClient = url
    // console.log(`calling to post to ${urlWithClient}`)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'michaelsfriendskey': token,
      }),
    }

    // console.log(JSON.stringify(body))

    return this.http.post<any>(urlWithClient, JSON.stringify(body), httpOptions)
  }

}
