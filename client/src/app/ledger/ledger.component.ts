import { Component, OnInit, Input } from '@angular/core'
import { ILedgerEntry } from './ledger.interface'
import { BackendService } from '../backend.service'
import { DemoDataProviderService } from '../demo-data-provider.service'
import * as moment from 'moment'
import { backendURL } from '../../configurations/configuration'

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css', '../app.component.css']
})

export class LedgerComponent implements OnInit {

  @Input() transactionId = ''

  public userIsAuthenticated = (BackendService.authenticationToken === '') ? false : true
  public ledgerEntries: ILedgerEntry[] = []
  public entryIdOfInterest: ILedgerEntry

  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit(): void {
    this.backendService.getLedgerEntries()
      .subscribe((result: ILedgerEntry[]) => {
        this.ledgerEntries = result
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight)
        }, 700)
      })
  }

  public getSum(): number {
    let sum = 0
    for (const e of this.ledgerEntries) {
      sum = sum + e.amount
    }

    return sum
  }


  public downloadAsCSV(): void {
    const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(this.ledgerEntries[0])
    let line = `${header}\n`
    let index = 0
    this.ledgerEntries.map((row) => header.map(fieldName => {
      index++
      if (index < header.length) {
        line = `${line}${JSON.stringify(row[fieldName], replacer)},`
      } else {
        line = `${line}${JSON.stringify(row[fieldName], replacer)}\n`
        index = 0
      }
    }))
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(line)
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute('download', `${moment().format('YYYY-MM-DD')} ${backendURL.split('https://')[1]}` + '.csv')
    document.body.appendChild(downloadAnchorNode) // required for firefox
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  public downloadAsJSON(): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.ledgerEntries))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute('download', `${moment().format('YYYY-MM-DD')} ${backendURL.split('https://')[1]}` + '.json')
    document.body.appendChild(downloadAnchorNode) // required for firefox
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  public onEntryClicked(ledgerEntry: ILedgerEntry) {
    this.entryIdOfInterest = ledgerEntry
    window.scrollTo(0, 0)
  }

  public backToOverview() {
    delete this.entryIdOfInterest
  }

  public getSource(): string {
    // tbd
    return 'User'
  }

  public getTarget(): string {
    // tbd
    return 'Task'
  }

}
