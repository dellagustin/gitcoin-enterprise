import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
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
  public static backendURL

  public constructor(private readonly http: HttpClient) {
  }

  public getLedgerEntries(token: string) {
    return this.get(`${BackendService.backendURL}/getLedgerEntries`, token)
  }

  public postTransfer(receivers: IBountyReceiver[], token: string) {
    return this.post(`${BackendService.backendURL}/postTransfer`, receivers, token)
  }

  // public sendEMail(eMail: IEmail, token: string): any {
  //   return this.post(`${BackendService.backendURL}/sendEMail`, eMail, token)
  // }

  public postSolutionApproach(application: IApplication, token: string): any {
    return this.post(`${BackendService.backendURL}/postSolutionApproach`, application, token)
  }

  public triggerBackup(token: string) {
    return this.post(`${BackendService.backendURL}/triggerBackup`, {}, token)
  }

  public saveFunding(taskAndFunding: ITaskAndFunding, token: string) {
    return this.post(`${BackendService.backendURL}/postFunding`, taskAndFunding, token)
  }

  public getUser(token: string) {
    return this.get(`${BackendService.backendURL}/getUser`, token)
  }

  public getFundedTasks(token: string) {
    return this.get(`${BackendService.backendURL}/getFundedTasks`, token)
  }

  public getPotentialReceivers(token: string) {
    return this.get(`${BackendService.backendURL}/getPotentialReceivers`, token)
  }

  public getAuthenticationData(token: string) {
    return this.get(`${BackendService.backendURL}/getAuthenticationData`, token)
  }

  public getIssueInfo(link: string, token: string) {
    const sourceString = link.split(`${BackendService.gitHubURL}/`)[1]
    const org = sourceString.split('/')[0]
    const repo = sourceString.split('/')[1].split('/')[0]
    const issueId = sourceString.split('/')[3]

    return this.get(`${BackendService.backendURL}/getIssueInfo/org/${org}/repo/${repo}/issueId/${issueId}`, token)
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
