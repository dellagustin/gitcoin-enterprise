import { Component, OnInit } from '@angular/core'
import { ILedgerEntry } from './ledger.interface'

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css', '../app.component.css']
})

export class LedgerComponent implements OnInit {

  public ledger: ILedgerEntry[] = []

  public constructor() { }

  public ngOnInit(): void {

    const entry1: ILedgerEntry = {
      id: '4711',
      date: '2020-01-01',
      amount: 100,
      sender: 'Hugo',
      receiver: 'Fritz',
    }

    this.ledger.push(entry1)

    const entry2: ILedgerEntry = {
      id: '4712',
      date: '2020-01-02',
      amount: 200,
      sender: 'Laura',
      receiver: 'Luisa',
    }

    this.ledger.push(entry2)

    const entry3: ILedgerEntry = {
      id: '4713',
      date: '2020-01-01',
      amount: 100,
      sender: 'Alex',
      receiver: 'Sascha-Michelle',
    }

    this.ledger.push(entry3)
  }

  public downloadAsCSV() {

  }

  public downloadAsJSON() {

  }

  public onEntryClicked() {

  }
}
