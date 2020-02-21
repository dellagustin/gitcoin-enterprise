import { Component, OnInit, Input } from '@angular/core';
import { ILedgerEntry } from '../ledger/ledger.interface';
import { IFunding } from '../interfaces';

@Component({
  selector: 'app-ledger-fundings',
  templateUrl: './ledger-fundings.component.html',
  styleUrls: ['./ledger-fundings.component.css', '../app.component.css']
})
export class LedgerFundingsComponent implements OnInit {

  @Input() usersFundings: IFunding[]

  public entryIdOfInterest: IFunding

  constructor() { }

  ngOnInit(): void {

  }

  public onEntryClicked(entry: IFunding) {
    this.entryIdOfInterest = entry
    window.scrollTo(0, 0)
  }
}
