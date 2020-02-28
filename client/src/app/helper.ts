import { ILedgerEntry } from './ledger/ledger.interface'
import { IFunding, IBountiesAndFundings, IBounty } from './interfaces'

export class Helper {
  public static getFundingsAndBountiesFromLedgerEntries(login: string, ledgerEntries: ILedgerEntry[]): IBountiesAndFundings {
    const entriesWithAddress = Helper.getLedgerEntriesByAddress(login, ledgerEntries)
    if (entriesWithAddress.length === 0) {
      throw new Error('check getFundingsFromLedgerEntries')
    }

    const fundings: IFunding[] = []
    const bounties: IBounty[] = []
    const uniqueTaskLinksOfBounties: string[] = []
    const uniqueTaskLinksOfFundings: string[] = []

    for (const entry of entriesWithAddress) {
      if (entry.sender === login) {
        const funding: IFunding = {
          id: entry.id,
          funderId: entry.sender,
          taskLink: entry.receiver,
          amount: entry.amount,
        }
        if (uniqueTaskLinksOfFundings.indexOf(funding.taskLink) === -1) {
          uniqueTaskLinksOfFundings.push(funding.taskLink)
        }

        fundings.push(funding)
      } else if (entry.receiver === login) {
        const bounty: IBounty = {
          bountyHunterId: entry.receiver,
          taskLink: entry.sender,
          amount: entry.amount,
        }
        if (uniqueTaskLinksOfBounties.indexOf(bounty.taskLink) === -1) {
          uniqueTaskLinksOfBounties.push(bounty.taskLink)
        }
        bounties.push(bounty)
      }

    }

    // alert(fundings.length)
    // alert(bounties.length)
    // alert(uniqueTaskLinksOfFundings)
    // alert(uniqueTaskLinksOfBounties)
    const consolidatedFundings: IFunding[] = []
    const consolidatedBounties: IBounty[] = []

    for (const uniqueTaskLink of uniqueTaskLinksOfFundings) {

      const fundingsForCurrentTaskLink: IFunding[] = fundings.filter((e: IFunding) => e.taskLink === uniqueTaskLink)
      let fundingForUniqueTaskLink
      if (fundingsForCurrentTaskLink.length > 0) {
        fundingForUniqueTaskLink = fundingsForCurrentTaskLink.reduce((previousValue: IFunding, currentValue: IFunding) => {
          const reduced = {
            id: '',
            funderId: '',
            taskLink: currentValue.taskLink,
            amount: previousValue.amount + currentValue.amount,
          }

          return reduced
        })

        consolidatedFundings.push(fundingForUniqueTaskLink)
      }
    }

    for (const uniqueTaskLink of uniqueTaskLinksOfBounties) {
      const bountiesForCurrentTaskLink: IBounty[] = bounties.filter((e: IBounty) => e.taskLink === uniqueTaskLink)
      let bountyForUniqueTaskLink
      if (bountiesForCurrentTaskLink.length > 0) {
        bountyForUniqueTaskLink = bountiesForCurrentTaskLink.reduce((previousValue: IBounty, currentValue: IBounty) => {
          const reduced = {
            bountyHunterId: currentValue.bountyHunterId,
            taskLink: currentValue.taskLink,
            amount: previousValue.amount + currentValue.amount,
          }

          return reduced
        })

        consolidatedBounties.push(bountyForUniqueTaskLink)
      }
    }

    // alert(consolidatedFundings.length)
    // alert(consolidatedBounties.length)
    return { fundings: consolidatedFundings, bounties: consolidatedBounties }
  }

  public static getENUMValueAsString(yourENUM: any, value: any): string {
    // tslint:disable-next-line: no-for-in
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
    // alert(link)
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
      }

      return false

    })
  }

}
