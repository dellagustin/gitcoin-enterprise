import { Component, OnInit, Input } from '@angular/core'
import { BackendService } from '../backend.service'
import { backendURL } from '../../configurations/configuration'
import { IUser, IAuthenticationData, IFunding } from '../interfaces'
import { ILedgerEntry } from '../ledger/ledger.interface'
import { Helper } from '../helper'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../app.component.css']
})
export class ProfileComponent implements OnInit {

  @Input() public authenticationData: IAuthenticationData
  public justKidding = true
  public viewBountiesAndFundings = false
  public fundingIdOfInterest
  public balance = 0
  public usersFundings: IFunding[] = []
  public usersBounties: IFunding[] = []
  public ledgerEntries: ILedgerEntry[] = []
  public entryIdOfInterest: ILedgerEntry

  public constructor(private readonly backendService: BackendService) { }

  public static getInitialUser() {
    const user: IUser = {
      avatarURL: 'https://avatars1.githubusercontent.com/u/43786652?v=4',
      balance: 0,
      link: '',
    }

    return user
  }

  public ngOnInit(): void {
    setTimeout(() => this.justKidding = false, 5000)
    this.backendService.getLedgerEntries(this.authenticationData.token)
      .subscribe((result: ILedgerEntry[]) => {
        this.ledgerEntries = result
        this.balance = Helper.getBalanceFromLedgerEntries(this.authenticationData.login, this.ledgerEntries)
        this.usersFundings = Helper.getFundingsFromLedgerEntries(this.authenticationData.login, this.ledgerEntries)
        // alert(this.usersFundings.length)
      })
    // alert(JSON.stringify(this.authenticationData))
  }

  public getLink() {
    return `https://github.com/${this.authenticationData.login}`
  }


  public getId(link: string): string {
    return Helper.getId(link)
  }

  public login() {
    window.location.assign(`${backendURL}/login`)
  }


  public loginViaGitHub() {
    const authenticationURL = `${backendURL}/login?action=profile`
    location.assign(authenticationURL)
  }

  public clickBountiesAndFundings() {
    this.viewBountiesAndFundings = true
  }

  public getSum(): number {
    let sum = 0
    for (const e of this.usersFundings) {
      sum = sum + e.amount
    }

    return sum
  }

  public onEntryClicked(funding: IFunding) {
    this.fundingIdOfInterest = funding
    window.scrollTo(0, 0)
  }

  // public onUserIdEntered() {

  //   this.backendService.getUser(this.user.id)
  //     .subscribe((user: IUser) => {
  //       if (user === undefined) {
  //         alert('Please enter a valid user ID')
  //       } else {
  //         this.user = user
  //         ProfileComponent.currentUser = this.user
  //       }
  //     },
  //     (error) => alert(error.message))
  // }


}
