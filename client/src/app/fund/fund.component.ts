import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { ITask, ETaskStatus, ETaskType, SolveComponent } from '../solve/solve.component';
import { IUser, ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.css', '../app.component.css']
})
export class FundComponent implements OnInit {

  public radioModel: any;
  public taskLink = 'https://github.com/cla-assistant/cla-assistant/issues/530';
  public task: ITask = SolveComponent.getInitialTask()
  public user: IUser = ProfileComponent.getInitialUser()

  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit(): void {
  }

  public getInfoFromTaskLink() {
    this.backendService.get(`${BackendService.backendBaseURL}/getissue/org/hi/repo/akshaywhats/issueId/up`)
      .subscribe((response: any) => {
        this.task = this.getTaskFromResponse(response);
      }, error => {
        console.log(error.message)
        this.task = this.getDefaultTaskForDemo()
      });
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
    };
  }

  private getDefaultTaskForDemo() {
    return {
      taskType: ETaskType.GitHubIssue,
      name: 'Just a Demo Task',
      description: 'Just a Demo Description',
      funding: 0,
      currency: 'EIC',
      status: ETaskStatus.created,
      funderRatedWith: 5,
      solutionProviderRatedWith: 5
    };

  }
}
