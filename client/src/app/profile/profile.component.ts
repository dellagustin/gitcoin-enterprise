import { Component, OnInit, Input } from '@angular/core'
import { BackendService } from '../backend.service'
import { backendURL } from '../../configurations/configuration'
import { IUser, IAuthenticationData, IFunding } from '../interfaces'

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
  public usersFundings: IFunding[] = []

  // public usersBounties: IFunding[] = []

  public constructor(private readonly backendService: BackendService) { }

  public static getInitialUser() {
    const user: IUser = {
      avatarURL: 'https://avatars1.githubusercontent.com/u/43786652?v=4',
      balance: 0,
      link: '',
    }

    return user
  }

  public getLink() {
    return `https://github.com/${this.authenticationData.login}`
  }

  public login() {
    window.location.assign(`${backendURL}/login`)
  }



  public ngOnInit(): void {
    setTimeout(() => this.justKidding = false, 2000)
    // alert(JSON.stringify(this.authenticationData))
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
