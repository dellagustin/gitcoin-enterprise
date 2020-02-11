import { Component, OnInit, Input } from '@angular/core'
import { BackendService, ITask, ETaskType, ETaskStatus } from '../backend.service'
import { backendURL } from '../../configurations/configuration'

import { IUser, ProfileComponent } from '../profile/profile.component'
import { DemoDataProviderService } from '../demo-data-provider.service'
import { TaskHelper } from '../task-card/task-helper'
import { IFunding, ITaskAndFunding } from '../interfaces'
import { ILedgerEntry } from '../ledger/ledger.interface'

@Component({
  selector: 'app-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.css', '../app.component.css']
})
export class FundComponent {

  @Input() public sessionWithoutCookies = ''
  public radioModel: any
  public taskLink = 'https://github.com/gitcoin-enterprise/gitcoin-enterprise/issues/16'
  public task: ITask = TaskHelper.getInitialTask()
  public currentRange = 200
  public fundingCompleted = false
  public userIsAuthorized = false
  public initialRange = 70
  public minimumRange = 10
  public maximumRange = 2000
  public viewTransactionInLedger = false
  public newLedgerEntry: ILedgerEntry


  public constructor(private readonly backendService: BackendService, private readonly demoDataProvider: DemoDataProviderService) { }

  public getInfoFromTaskLink() {
    const sourceString = this.taskLink.split('https://github.com/')[1]
    const org = sourceString.split('/')[0]
    const repo = sourceString.split('/')[1].split('/')[0]
    const issueId = sourceString.split('/')[3]
    this.backendService.get(`${backendURL}/getIssueInfo/org/${org}/repo/${repo}/issueId/${issueId}`, this.sessionWithoutCookies)
      .subscribe((response: any) => {
        this.task = this.getTaskFromResponse(response)
        this.task.link = this.taskLink
        this.task.funding = this.currentRange
      }, error => {
        console.log(error.message)
        this.task = this.demoDataProvider.getDefaultTaskForDemo()
      })
  }

  public handleRangeSetting() {
    this.task.funding = this.currentRange
  }

  public login() {
    window.location.assign(`${backendURL}/login?sessionWithoutCookies=${this.sessionWithoutCookies}`)
  }

  public clickViewTransactionInLedger() {
    this.viewTransactionInLedger = true
  }

  public saveFunding() {
    this.fundingCompleted = true
    const saveFundingURL = `${backendURL}/postFunding`

    const funding: IFunding = {
      id: '',
      taskId: this.task.id,
      funderId: this.sessionWithoutCookies,
      amount: this.currentRange,
    }
    const taskAndFunding: ITaskAndFunding = {
      task: this.task,
      funding
    }
    this.backendService.post(saveFundingURL, taskAndFunding, this.sessionWithoutCookies)
      .subscribe((newLedgerEntry: ILedgerEntry) => {
        this.newLedgerEntry = newLedgerEntry
      })
  }

  // public onUserIdEntered() {

  //   this.backendService.getUser(this.user.id)
  //     .subscribe((user: IUser) => {
  //       if (user === undefined) {
  //         alert('Please enter a valid user ID')
  //       } else {
  //         this.user = user
  //         ProfileComponent.currentUser = this.user
  //       }
  //     }, error => alert(error.message))

  // }

  private getTaskFromResponse(response: any): ITask {
    return {
      id: '1',
      taskType: ETaskType.GitHubIssue,
      name: response.title,
      description: response.description,
      funding: 0,
      currency: 'EIC',
      status: ETaskStatus.created,
      funderRatedWith: 5,
      solutionProviderRatedWith: 5,
      link: '',
      dueDate: ''
    }
  }
}
