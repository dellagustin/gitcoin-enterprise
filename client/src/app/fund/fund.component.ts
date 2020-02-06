import { Component, OnInit } from '@angular/core'
import { BackendService, ITask, ETaskType, ETaskStatus } from '../backend.service'
import { backendURL } from '../../configurations/configuration'

import { IUser, ProfileComponent } from '../profile/profile.component'
import { DemoDataProviderService } from '../demo-data-provider.service'
import { TaskHelper } from '../task-card/task-helper'

@Component({
  selector: 'app-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.css', '../app.component.css']
})
export class FundComponent implements OnInit {

  public radioModel: any
  public user: IUser = ProfileComponent.currentUser
  public task: ITask = TaskHelper.getInitialTask()
  public currentRange = 0
  public fundingCompleted = false
  public initialRange = 70
  public minimumRange = 10
  public maximumRange = 100


  public constructor(private readonly backendService: BackendService,
                     private readonly demoDataProvider: DemoDataProviderService) { }

  public ngOnInit(): void {
  }

  public getInfoFromTaskLink() {
    const sourceString = this.task.link.split('https://github.com/')[1]
    // cla-assistant/cla-assistant/issues/530
    const org = sourceString.split('/')[0]
    const repo = sourceString.split('/')[1].split('/')[0]
    const issueId = sourceString.split('/')[3]
    this.backendService.get(`${backendURL}/getIssueInfo/org/${org}/repo/${repo}/issueId/${issueId}`)
      .subscribe((response: any) => {
        this.task = this.getTaskFromResponse(response)
      }, error => {
        console.log(error.message)
        this.task = this.demoDataProvider.getDefaultTaskForDemo()
      })
  }

  public handleRangeSetting() {
    this.task.funding = this.currentRange
  }

  public saveFunding() {
    // if (confirm("Are you sure?")) {
    this.fundingCompleted = true
    // }
  }

  public onUserIdEntered() {

    this.user = this.backendService.getUser(this.user.companyId)
    if (this.user === undefined) {
      alert('Please enter a valid user ID')
      this.user = ProfileComponent.getInitialUser()
    }

    ProfileComponent.currentUser = this.user
  }

  private getTaskFromResponse(response: any): ITask {
    return {
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
