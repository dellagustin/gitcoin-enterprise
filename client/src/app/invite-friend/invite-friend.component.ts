import { Component, OnInit, Input } from '@angular/core'
import { BackendService } from '../backend.service'
import { IEmail, IAuthenticationData } from '../interfaces'

@Component({
  selector: 'app-invite-friend',
  templateUrl: './invite-friend.component.html',
  styleUrls: ['./invite-friend.component.css', '../app.component.css'],
})
export class InviteFriendComponent implements OnInit {

  @Input() public authenticationData: IAuthenticationData
  public url = BackendService.backendURL
  // public eMailAddress = 'akshay.iyyaudarai.balasundaram@sap.com'
  public eMailAddress = 'michael@peer2peer-enterprise.org'
  public invitingUsersAddress = 'michael.spengler@sap.com'
  public sent = false
  public permissionGranted = false
  public eMail: IEmail

  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit(): void {
    // tbd
  }

  // public send() {
  //   this.eMail.senderUserId = ProfileComponent.currentUser.id
  //   this.backendService.sendEMail(this.eMail, ProfileComponent.currentUser.id)
  //     .subscribe((result: any) => {
  //       if (result.success === false) {
  //         alert('I did not send this E-Mail. Perhaps there had already been an invitation related to this E-Mail before.')
  //       } else {
  //         this.sent = true
  //       }
  //     })
  // }

  // public onUserIdEntered() {

  //   this.backendService.getUser(this.user.id)
  //     .subscribe((user: IUser) => {
  //       if (user === null || user === undefined) {
  //         alert('Please enter a valid user ID')
  //       } else {
  //         this.user = user
  //         ProfileComponent.currentUser = this.user
  //       }
  //     }, error => alert(error.message))
  // }

  public copyText() {
    const selBox = document.createElement('textarea')
    selBox.style.position = 'fixed'
    selBox.style.left = '0'
    selBox.style.top = '0'
    selBox.style.opacity = '0'
    selBox.value = document.URL
    document.body.appendChild(selBox)
    selBox.focus()
    selBox.select()
    selBox.setSelectionRange(0, 9999)
    document.execCommand('copy')
    document.body.removeChild(selBox)

    // alert(NavbarComponent.operatingSystem);
    alert('Invitationlink copied to clipboard')
  }
}
