import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { IFunding, IBountyReceiver } from '../interfaces'
import { BackendService } from '../backend.service'

@Component({
  selector: 'app-ledger-fundings',
  templateUrl: './ledger-fundings.component.html',
  styleUrls: ['./ledger-fundings.component.css', '../app.component.css'],
})
export class LedgerFundingsComponent implements OnInit {

  @Input() public usersFundings: IFunding[]
  @Input() public p2pAccessToken: string
  @Output() public transferTriggered = new EventEmitter<IBountyReceiver[]>()

  public entryIdOfInterest: IFunding
  public receivers: IBountyReceiver[] = []
  public selectedItem = ''
  public potentialReceivers: string[] = []

  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit() {
    this.backendService.getPotentialReceivers(this.p2pAccessToken)
      .subscribe((potentialReceivers: string[]) => {
        this.potentialReceivers = potentialReceivers
        alert(this.potentialReceivers)
      })
  }

  public onEntryClicked(entry: IFunding) {
    this.receivers.push({ login: entry.funderId, amount: entry.amount, bountyForTaskLink: entry.taskLink })
    this.entryIdOfInterest = entry
  }

  public getIt(taskLink: string) {
    const array = taskLink.split('/')

    return `${array[4]}/${array[6]}`
  }

  public addReceiver() {
    if (this.getSum() >= this.entryIdOfInterest.amount) {
      alert('You are already at 100%. Please reduce percentage before adding another receiver.')
    } else {
      alert(this.entryIdOfInterest.taskLink)
      this.receivers.push({ login: '', amount: 0, bountyForTaskLink: this.entryIdOfInterest.taskLink })
    }
  }

  public onReceiverSelected(item: string) {
    alert(item)
  }

  public transferCoins() {
    let loginValid = true
    for (const e of this.receivers) {
      if (e.amount > 0 && e.login === '') {
        loginValid = false
      }
    }

    if (!loginValid) {
      alert(`Why would you give something to empty space?`)
    } else {
      this.transferTriggered.emit(this.receivers)
    }
  }

  private getSum() {
    let sum = 0
    for (const r of this.receivers) {
      sum += r.amount
    }

    return sum
  }

}
