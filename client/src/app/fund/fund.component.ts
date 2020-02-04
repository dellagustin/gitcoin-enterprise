import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.css', '../app.component.css']
})
export class FundComponent implements OnInit {

  public radioModel: any;
  public taskLink = 'https://github.com/cla-assistant/cla-assistant/issues/530';
  public taskTypes: string[] = ['GitHub Issue', 'tbd...', 'tbd...'];
  public selectedTaskType = '';

  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit(): void {
  }

  public onTaskTypeSelected(taskType: string) {
    this.selectedTaskType = taskType;
  }

  public getInfoFromTaskLink() {
    this.backendService.get(`${BackendService.backendBaseURL}/getissue/org/hi/repo/akshaywhats/issueId/up`)
      .subscribe((result: any) => {
        alert(result.issueTitle)
        alert(result.issueDescription)
      });
  }

}
