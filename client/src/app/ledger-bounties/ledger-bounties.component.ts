import { Component, OnInit, Input } from '@angular/core'
import { IBounty } from '../interfaces'

@Component({
  selector: 'app-ledger-bounties',
  templateUrl: './ledger-bounties.component.html',
  styleUrls: ['./ledger-bounties.component.css', '../app.component.css'],
})
export class LedgerBountiesComponent {

  @Input() public usersBounties: IBounty[]
  public entryIdOfInterest: IBounty

  public onEntryClicked(entry: IBounty) {
    this.entryIdOfInterest = entry
    window.scrollTo(0, 0)
  }

  public getIt(taskLink: string) {
    const array = taskLink.split('/')

    return `${array[4]}/${array[6]}`
  }

}
