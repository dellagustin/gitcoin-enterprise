import { Component, OnInit } from '@angular/core'
import { ILedgerEntry } from './ledger.interface'
import { BackendService } from '../backend.service'

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css', '../app.component.css']
})

export class LedgerComponent implements OnInit {

  public ledger: ILedgerEntry[] = []
  public entryIdOfInterest: ILedgerEntry

  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit(): void {
    this.backendService.getLedgerEntries()
      .subscribe((result: ILedgerEntry[]) => {
        this.ledger = result
      }, error => {
        console.log('probably no connection to server - delivering demo data')
        this.ledger = this.backendService.getDefaultLedgerEntriesForDemo()
      })
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
