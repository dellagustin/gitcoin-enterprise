import { Component, OnInit, Input } from '@angular/core'
import { BackendService } from '../backend.service'
import { backendURL } from '../../configurations/configuration'
import { IApplication, IAuthenticationData, ITask } from '../interfaces'
import { IMessage } from '../typing-area/typing-area.component'


@Component({
  selector: 'app-solve',
  templateUrl: './solve.component.html',
  styleUrls: ['./solve.component.css', '../app.component.css']
})
export class SolveComponent implements OnInit {

  @Input() public taskOfInterest: ITask
  @Input() public authenticationData: IAuthenticationData
  public fundedTasks: ITask[] = []
  public filteredTasks: ITask[] = []
  public messages: IMessage[] = [{ fromChatBot: true, text: 'This starts to sound like a plan :)' }]
  public searchTerm = ''
  public solutionApproach = ''
  public sortingDirectionDown = false
  public userWantsToApply = false
  public applicationCompleted = false
  // public user: IUser = ProfileComponent.currentUser

  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit(): void {
    this.backendService.getFundedTasks(this.authenticationData.token)
      .subscribe((result: ITask[]) => {
        this.fundedTasks = result
        this.filteredTasks = this.sortDescending(this.fundedTasks)
      })
  }

  public applyForSolvingAfterUserIdAdded() {

    // this.backendService.getUser(this.user.id)
    //   .subscribe((result: IUser) => {
    //     this.user = result
    //     ProfileComponent.currentUser = this.user
    //     this.apply()
    //   })
  }

  public applyForSolving(): void {
    this.userWantsToApply = true
    this.apply()
  }

  public apply(): void {
    this.applicationCompleted = true
    const application: IApplication = {
      taskLink: this.taskOfInterest.link,
      plan: this.solutionApproach
    }

    this.backendService.postApplication(application, this.authenticationData.token)
      .subscribe()

  }

  public searchTask(): void {
    this.filteredTasks = this.fundedTasks.filter((entry: ITask) => {
      if (entry.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1) {
        return true
      } else {
        return false
      }
    })
  }

  public onTaskClicked(taskOfInterest: ITask): void {
    this.taskOfInterest = taskOfInterest
  }

  public backToOverview(): void {
    delete this.taskOfInterest
  }

  public onTyping(event: any) {
    // no need to consider this here :)
  }

  public sort(): ITask[] {
    this.sortingDirectionDown = !this.sortingDirectionDown

    return (this.sortingDirectionDown) ?
      this.sortAscending(this.filteredTasks) :
      this.sortDescending(this.filteredTasks)
  }

  private sortAscending(tasks: ITask[]): ITask[] {
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

  private sortDescending(tasks: ITask[]): ITask[] {
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
