import { Component, OnInit, Input } from '@angular/core'
import { ITask } from '../backend.service'

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css', '../app.component.css']
})
export class TaskCardComponent implements OnInit {

  @Input() task: ITask


  public constructor() { }

  ngOnInit(): void {
  }

}
