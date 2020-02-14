import { ILedgerEntry } from './ledger/ledger.interface'
import { IFunding } from './interfaces'

export class Helper {
  static getFundingsFromLedgerEntries(login: string, ledgerEntries: ILedgerEntry[]): IFunding[] {
    const entriesWithAddress = Helper.getLedgerEntriesByAddress(login, ledgerEntries)
    if (entriesWithAddress.length === 0) {
      throw new Error('check getFundingsFromLedgerEntries')
    }

    const fundings: IFunding[] = []
    for (const entry of entriesWithAddress) {
      if (entry.sender === login) {

        const funding: IFunding = {
          id: entry.id,
          funderId: entry.sender,
          taskLink: entry.receiver,
          amount: entry.amount
        }
        fundings.push(funding)
      }
    }

    return fundings
  }

  public static getENUMValueAsString(yourENUM: any, value: any): string {
    for (const o in yourENUM) {
      if (yourENUM.hasOwnProperty(o)) {
        if (Number(o) === value) {
          return yourENUM[o]
        }
      }
    }
    return 'entry not found in your ENUM'
  }

  public static getId(link: string): string {
    const myArray = link.split('/')
    return `${myArray[myArray.length - 3]}/${myArray[myArray.length - 1]}`
  }

  public static getBalanceFromLedgerEntries(address: string, ledgerEntries: ILedgerEntry[]): number {

    const entriesWithAddress = Helper.getLedgerEntriesByAddress(address, ledgerEntries)
    if (entriesWithAddress.length === 0) {
      throw new Error('unexpected situation in getBalanceFromLedgerEntries')
    }

    let balance = 0
    for (const entry of entriesWithAddress) {
      if (entry.sender === address) {
        balance = balance - entry.amount
      } else if (entry.receiver === address) {
        balance = balance + entry.amount
      }
    }
    return balance

  }


  public static getLedgerEntriesByAddress(address: string, allLedgerEntries: ILedgerEntry[]): ILedgerEntry[] {

    return allLedgerEntries.filter((ledgerEntry: ILedgerEntry) => {
      if (ledgerEntry.sender === address || ledgerEntry.receiver === address) {
        return true
      } else {
        return false
      }
    })
  }

}
