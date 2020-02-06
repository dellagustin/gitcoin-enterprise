import { Component, OnInit, Input } from '@angular/core'
import { BackendService, ITask } from '../backend.service'
import { ProfileComponent } from '../profile/profile.component'
import { backendURL } from '../../configurations/configuration'


@Component({
  selector: 'app-solve',
  templateUrl: './solve.component.html',
  styleUrls: ['./solve.component.css', '../app.component.css']
})
export class SolveComponent implements OnInit {

  @Input() public fundedTasks: ITask[] = []

  public taskOfInterest: ITask
  public filteredTasks: ITask[] = []
  public searchTerm = ''
  public sortingDirectionDown = false

  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit(): void {
    this.backendService.getFundedTasks()
      .subscribe((result: ITask[]) => {
        this.fundedTasks = result
        this.filteredTasks = this.sortDescending(this.fundedTasks)
      })
  }

  public applyForSolving() {
    this.backendService.get(`${backendURL}/applyForSolving`, ProfileComponent.currentUser.id)
      .subscribe()
  }

  public searchTask() {
    this.filteredTasks = this.fundedTasks.filter((entry: ITask) => {
      if (entry.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1) {
        return true
      } else {
        return false
      }
    })
  }

  public onTaskClicked(taskOfInterest: ITask) {
    this.taskOfInterest = taskOfInterest
  }

  public backToOverview() {
    delete this.taskOfInterest
  }

  public sort() {
    this.sortingDirectionDown = !this.sortingDirectionDown

    return (this.sortingDirectionDown) ?
      this.sortAscending(this.filteredTasks) :
      this.sortDescending(this.filteredTasks)
  }

  private sortAscending(tasks: ITask[]) {
    return tasks.sort((task1: ITask, task2: ITask) => {
      if (task1.funding > task2.funding) {
        return 1
      }

      if (task1.funding < task2.funding) {
        return -1
      }

      return 0
    })
  }

  private sortDescending(tasks: ITask[]) {
    return tasks.sort((task1: ITask, task2: ITask) => {
      if (task1.funding < task2.funding) {
        return 1
      }

      if (task1.funding > task2.funding) {
        return -1
      }

      return 0
    })
  }

}
