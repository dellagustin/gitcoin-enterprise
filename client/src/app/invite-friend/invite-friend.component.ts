import { Component, OnInit } from '@angular/core'
import { IEmail } from '../email/email.component'

import * as uuidv1 from 'uuid/v1'
import { BackendService } from '../backend.service'

@Component({
  selector: 'app-invite-friend',
  templateUrl: './invite-friend.component.html',
  styleUrls: ['./invite-friend.component.css', '../app.component.css']
})
export class InviteFriendComponent implements OnInit {


  public url = 'https://gitcoin-enterprise.org'
  public eMailAdress = 'akshay.iyyaudarai.balasundaram@sap.com'
  public invitingUsersAdress = 'michael@spengler.biz'
  public sending = false
  public permissionGranted = false
  public eMail: IEmail
  public personalAuthenticationToken

  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit(): void {

    this.personalAuthenticationToken = uuidv1()
    this.eMail = {
      sender: this.invitingUsersAdress,
      recipient: this.eMailAdress,
      subject: `Invitation to ${this.url}`,
      // tslint:disable-next-line: max-line-length
      content: `Hi. Your friend ${this.invitingUsersAdress} invited you to join ${this.url}. Your personal access link is ${this.url}?id=${this.personalAuthenticationToken}. Everyone who has this link can trigger actions in your name. Please store it securely.`
    }
  }

  public send() {
    this.sending = true
    if (confirm(`sending E-Mail to ${this.eMailAdress}`)) {
      this.backendService.sendEMail(this.eMail)
        .subscribe()
    }
  }
}
