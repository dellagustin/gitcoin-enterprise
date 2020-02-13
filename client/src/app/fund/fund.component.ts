import { Component, OnInit, Input } from '@angular/core'
import { BackendService, ETaskStatus } from '../backend.service'
import { backendURL } from '../../configurations/configuration'
import { DemoDataProviderService } from '../demo-data-provider.service'
import { TaskHelper } from '../task-card/task-helper'
import { IFunding, ITaskAndFunding, IAuthenticationData, ETaskType, ITask } from '../interfaces'
import { ILedgerEntry } from '../ledger/ledger.interface'

@Component({
  selector: 'app-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.css', '../app.component.css']
})
export class FundComponent implements OnInit {

  @Input() public authenticationData: IAuthenticationData
  public radioModel: any
  public taskLink = 'https://github.com/gitcoin-enterprise/gitcoin-enterprise/issues/16'
  public task: ITask = TaskHelper.getInitialTask()
  public fundingCompleted = false
  public minimumRange = 2
  public currentRange = 20
  public maximumRange = 200
  public viewTransactionInLedger = false
  public newLedgerEntry: ILedgerEntry


  public constructor(private readonly backendService: BackendService, private readonly demoDataProvider: DemoDataProviderService) { }

  public ngOnInit() {
    // alert(this.authenticationData.token)
    this.maximumRange = this.authenticationData.balance
  }

  public getInfoFromTaskLink() {
    const sourceString = this.taskLink.split('https://github.com/')[1]
    const org = sourceString.split('/')[0]
    const repo = sourceString.split('/')[1].split('/')[0]
    const issueId = sourceString.split('/')[3]

    this.backendService.getIssueInfo(org, repo, issueId, this.authenticationData.token)
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

  public clickViewTransactionInLedger() {
    this.viewTransactionInLedger = true
  }

  public saveFunding() {
    this.fundingCompleted = true

    const funding: IFunding = {
      id: '', // will be provided by backend
      funderId: this.authenticationData.login,
      taskLink: this.task.link,
      amount: this.currentRange,
    }
    const taskAndFunding: ITaskAndFunding = {
      task: this.task,
      funding
    }

    this.backendService.saveFunding(taskAndFunding, this.authenticationData.token)
      .subscribe((newLedgerEntry: ILedgerEntry) => {
        this.newLedgerEntry = newLedgerEntry
      })
  }

  private getTaskFromResponse(response: any): ITask {
    return {
      link: '',
      taskType: ETaskType.GitHubIssue,
      name: response.title,
      description: response.description,
      funding: 0,
      currency: 'EIC',
      status: ETaskStatus.created,
      funderRatedWith: 5,
      solutionProviderRatedWith: 5,
      dueDate: ''
    }
  }
}
