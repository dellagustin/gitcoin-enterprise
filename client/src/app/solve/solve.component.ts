import { Component, OnInit } from '@angular/core';

export interface ITask {
  taskType: ETaskType;
  name: string;
  description: string;
  funding: number;
  currency: string;
  status: ETaskStatus;
  funderRatedWith: number;
  solutionProviderRatedWith: number;
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

@Component({
  selector: 'app-solve',
  templateUrl: './solve.component.html',
  styleUrls: ['./solve.component.css', '../app.component.css']
})
export class SolveComponent implements OnInit {

  public task: ITask;
  public searchTerm = '';

  public static getInitialTask(): ITask {
    return {
      taskType: ETaskType.GitHubIssue,
      name: '',
      description: '',
      funding: 0,
      currency: 'EIC',
      status: ETaskStatus.created,
      funderRatedWith: 5,
      solutionProviderRatedWith: 5
    };
  }
  constructor() { }

  ngOnInit(): void {
  }

  public searchTask() {

  }
}
