import { Component, Input, OnInit } from '@angular/core'
import { IUser } from '../profile/profile.component'

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css', '../app.component.css']
})
export class UserCardComponent implements OnInit {

  public user: IUser

  public ngOnInit() {
    // implement the call here with this.sessionWithoutCookies
  }
}
