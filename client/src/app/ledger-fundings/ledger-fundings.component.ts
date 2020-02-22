import { Component, OnInit, Input } from '@angular/core'
import { IFunding, IReceiver } from '../interfaces'

@Component({
  selector: 'app-ledger-fundings',
  templateUrl: './ledger-fundings.component.html',
  styleUrls: ['./ledger-fundings.component.css', '../app.component.css']
})
export class LedgerFundingsComponent implements OnInit {

  @Input() usersFundings: IFunding[]

  public entryIdOfInterest: IFunding
  public receivers: IReceiver[] = []

  constructor() { }

  ngOnInit(): void {
    this.receivers.push({ login: '', percentage: 100 })
  }

  public onEntryClicked(entry: IFunding) {
    this.entryIdOfInterest = entry
  }

  public getIt(taskLink: string) {
    const array = taskLink.split('/')
    return `${array[4]}/${array[6]}`
  }

  public addReceiver() {
    if (this.getSum() >= 100) {
      alert('You are already at 100%. Please reduce percentage before adding another receiver.')
    } else {
      this.receivers.push({ login: '', percentage: 10 })
    }
  }

  public send() {
    let loginValid = true
    for (const e of this.receivers) {
      if (e.percentage > 0 && e.login === '') {
        loginValid = false
      }
    }

    if (!loginValid) {
      alert(`Why would you give something to empty space?`)
    } else if (this.getSum() !== 100) {
      alert('You can send this transaction as soon as you distributed 100%')
    } else {
      alert('Transaction sent successfully. You can check the latest ledger entries now.')
    }
  }


  private getSum() {
    let sum = 0
    for (const r of this.receivers) {
      sum += r.percentage
    }
    return sum
  }

}
