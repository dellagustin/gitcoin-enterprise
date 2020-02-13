import { Component, Input } from '@angular/core'
import { ETaskStatus, } from '../backend.service'
import { Helper } from '../helper'
import { ITask } from '../interfaces'

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css', '../app.component.css']
})
export class TaskCardComponent {

  @Input() task: ITask

  public getStatusText(value: any): string {
    return Helper.getENUMValueAsString(ETaskStatus, value)
  }

  public getId() {
     return Helper.getId(this.task.link)
  }
}
