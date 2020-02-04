import { Component, OnInit } from '@angular/core';

export interface ITask {
  name: string;
  description;
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

@Component({
  selector: 'app-solve',
  templateUrl: './solve.component.html',
  styleUrls: ['./solve.component.css', '../app.component.css']
})
export class SolveComponent implements OnInit {

  public task: ITask;
  public searchTerm = '';

  constructor() { }

  ngOnInit(): void {
  }

  public searchTask() {

  }
}
