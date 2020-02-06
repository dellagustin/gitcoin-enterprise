import { Component, OnInit, Input } from '@angular/core'
import { ILedgerEntry } from './ledger.interface'
import { BackendService } from '../backend.service'
import { DemoDataProviderService } from '../demo-data-provider.service'

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css', '../app.component.css']
})

export class LedgerComponent implements OnInit {

  @Input() public ledgerEntries: ILedgerEntry[] = []
  public entryIdOfInterest: ILedgerEntry

  public constructor(private readonly backendService: BackendService,
                     private readonly demoDataProvider: DemoDataProviderService) { }

  public ngOnInit(): void {
  }

  public downloadAsCSV() {
    alert('to be developed...')
  }

  public downloadAsJSON() {
    alert('to be developed...')
  }

  public onEntryClicked(ledgerEntry: ILedgerEntry) {
    this.entryIdOfInterest = ledgerEntry
  }

  public backToOverview() {
    delete this.entryIdOfInterest
  }
}
