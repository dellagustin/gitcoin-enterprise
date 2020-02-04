import { Component, OnInit } from '@angular/core'
import { BackendService, ITask, ETaskType, ETaskStatus } from '../backend.service'
import { IUser } from '../profile/profile.component'

@Component({
  selector: 'app-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.css', '../app.component.css']
})
export class FundComponent implements OnInit {

  public radioModel: any
  public taskLink = 'https://github.com/cla-assistant/cla-assistant/issues/530'
  public user: IUser = BackendService.getInitialUser()
  public task: ITask = BackendService.getInitialTask()
  public currentRange = 0
  public fundingCompleted = false
  public initialRange = 70
  public minimumRange = 10
  public maximumRange = 100


  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit(): void {
  }

  public getInfoFromTaskLink() {
    this.backendService.get(`${BackendService.backendBaseURL}/getissue/org/hi/repo/akshaywhats/issueId/up`)
      .subscribe((response: any) => {
        this.task = this.getTaskFromResponse(response)
      }, error => {
        console.log(error.message)
        this.task = this.backendService.getDefaultTaskForDemo()
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
      this.user = BackendService.getInitialUser()
    }
  }

  private getTaskFromResponse(response: any) {
    return {
      taskType: ETaskType.GitHubIssue,
      name: response.issueTitle,
      description: response.issueDescription,
      funding: 0,
      currency: 'EIC',
      status: ETaskStatus.created,
      funderRatedWith: 5,
      solutionProviderRatedWith: 5
    }
  }
}
