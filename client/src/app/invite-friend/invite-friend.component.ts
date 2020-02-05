import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-invite-friend',
  templateUrl: './invite-friend.component.html',
  styleUrls: ['./invite-friend.component.css', '../app.component.css']
})
export class InviteFriendComponent implements OnInit {

  public eMailAdress = ''
  public permissionGranted = false

  public constructor() { }

  public ngOnInit(): void {
  }

  public send() {
    if (confirm(`sending E-Mail to ${this.eMailAdress}`)) {
      alert('yeah')
    }
  }
}
