import { Component, OnInit, Input } from '@angular/core'
import { BackendService } from '../backend.service'
import { IApplication, IAuthenticationData, ITask } from '../interfaces'
import { IMessage } from '../typing-area/typing-area.component'

@Component({
  selector: 'app-solve',
  templateUrl: './solve.component.html',
  styleUrls: ['./solve.component.css', '../app.component.css'],
})
export class SolveComponent implements OnInit {

  @Input() public taskOfInterest: ITask
  @Input() public authenticationData: IAuthenticationData
  public fundedTasks: ITask[] = []
  public filteredTasks: ITask[] = []
  public messagesToMotivateANicePlan: IMessage[] = this.getMessagesToMotivateANicePlan()
  public messagesToStartSolving: IMessage[] = this.getMessagesToStartSolving()
  public searchTerm = ''
  public countDown = 8
  public solutionApproach = ''
  public sortingDirectionDown = false
  public userWantsToStartSolving = false
  // public user: IUser = ProfileComponent.currentUser

  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit(): void {
    this.backendService.getFundedTasks(this.authenticationData.p2pAccessToken)
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

  public solve(): void {
    this.userWantsToStartSolving = true
    const application: IApplication = {
      taskLink: this.taskOfInterest.link,
      plan: this.solutionApproach,
    }

    this.backendService.postSolutionApproach(application, this.authenticationData.p2pAccessToken)
      .subscribe()
  }

  // public getBalance(): number {
  //   return Helper.getBalanceFromLedgerEntries(this.authenticationData.login, this.ledgerEntries)
  // }

  public searchTask(): void {
    this.filteredTasks = this.fundedTasks.filter((entry: ITask) => {
      if (entry.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1) {
        return true
      }

      return false

    })
  }

  public onTaskClicked(taskOfInterest: ITask): void {
    this.taskOfInterest = taskOfInterest
  }

  public backToOverview(): void {
    delete this.taskOfInterest
  }

  public onTyping(event: any) {
    if ((!event) && this.userWantsToStartSolving) {

      const intervalId = setInterval(() => {
        this.countDown -= 1
        if (this.countDown === 3) {
          window.location.assign(this.taskOfInterest.link) // starting here for a flow experience :)
        }
        if (this.countDown === -1) {
          clearInterval(intervalId)
        }
      },                             1000)

    }
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

  private getMessagesToMotivateANicePlan(): IMessage[] {
    return [
      { fromChatBot: true, text: 'This starts to sound like a plan :)' },
      { fromChatBot: true, text: 'You could add the info until when you plan to complete this task.' }]
  }

  private getMessagesToStartSolving(): IMessage[] {
    return [
      { fromChatBot: true, text: 'Congratulations. You are a brave person to take this challenge :)' },
      // { fromChatBot: true, text: 'https://brave.com' },
      // { fromChatBot: true, text: ' ' },
      // { fromChatBot: true, text: ' \n' },
      // { fromChatBot: true, text: '' },
      // { fromChatBot: true, text: 'I commented the issue and included with your plan.' },
      { fromChatBot: true, text: 'As soon as you solved this task post a comment on the issue claiming your bounty :)' },
      { fromChatBot: true, text: 'I wish you good luck and will forward you to the issue in about 7 seconds.' }]
  }
}
