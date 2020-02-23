import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { IFunding, IBountyReceiver } from '../interfaces'

@Component({
  selector: 'app-ledger-fundings',
  templateUrl: './ledger-fundings.component.html',
  styleUrls: ['./ledger-fundings.component.css', '../app.component.css']
})
export class LedgerFundingsComponent implements OnInit {

  @Input() usersFundings: IFunding[]
  @Output() transferTriggered = new EventEmitter<IBountyReceiver[]>()

  public entryIdOfInterest: IFunding
  public receivers: IBountyReceiver[] = []

  constructor() { }

  ngOnInit(): void {
    this.receivers.push({ login: 'michael-spengler', amount: 0, bountyForTaskLink: '' })
    // this.receivers.push({ login: '', amount: 0, bountyForTaskLink: '' })
  }

  public onEntryClicked(entry: IFunding) {
    this.receivers[0].amount = entry.amount
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
      this.receivers.push({ login: '', amount: 0, bountyForTaskLink: this.entryIdOfInterest.taskLink })
    }
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
    } else if (this.getSum() !== this.entryIdOfInterest.amount) {
      alert('You can send this transaction as soon as you distributed 100%.')
    } else {
      this.transferTriggered.emit(this.receivers)
      alert('Transaction sent successfully. You can check the latest ledger entries now.')
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
