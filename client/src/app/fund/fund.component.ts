import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { BackendService, ETaskStatus } from '../backend.service'

import { TaskHelper } from '../task-card/task-helper'
import { IFunding, ITaskAndFunding, IAuthenticationData, ITask } from '../interfaces'
import { ILedgerEntry } from '../ledger/ledger.interface'
import { Helper } from '../helper'

@Component({
  selector: 'app-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.css', '../app.component.css'],
})
export class FundComponent implements OnInit {

  @Input() public authenticationData: IAuthenticationData
  @Output() public viewTransactionInLedgerTriggered = new EventEmitter<ILedgerEntry>()
  public radioModel: any
  public taskLink = TaskHelper.getDemoTaskLink()
  public task: ITask = TaskHelper.getInitialTask()
  public fundingCompleted = false
  public minimumRange = 1
  public balance = 200
  public currentRange = 20
  public newLedgerEntry: ILedgerEntry
  public ledgerEntries: ILedgerEntry[] = []

  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit() {
    this.backendService.getLedgerEntries(this.authenticationData.p2pAccessToken)
      .subscribe((result: ILedgerEntry[]) => {
        this.ledgerEntries = result
        this.balance = Helper.getBalanceFromLedgerEntries(this.authenticationData.login, this.ledgerEntries)
        this.currentRange = Math.round(this.balance / 10)
      })

    // alert(this.authenticationData.p2pAccessToken)
  }

  public getInfoFromTaskLink() {
    this.backendService.getIssueInfo(this.taskLink, this.authenticationData.p2pAccessToken)
      .subscribe((response: any) => {
        this.task = {
          link: this.taskLink,
          title: response.title,
          description: response.description,
          funding: 0,
        }
        this.task.funding = this.currentRange
      },         (error) => {
        alert(error.message)
      })
  }

  public handleRangeSetting() {
    this.task.funding = this.currentRange
  }

  public clickViewTransactionInLedger() {
    this.viewTransactionInLedgerTriggered.emit(this.newLedgerEntry)
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
      funding,
    }

    alert(JSON.stringify(taskAndFunding.task))
    this.backendService.saveFunding(taskAndFunding, this.authenticationData.p2pAccessToken)
      .subscribe((newLedgerEntry: ILedgerEntry) => {
        this.newLedgerEntry = newLedgerEntry
      })
  }

}
