import { Component, OnInit, Input } from '@angular/core'
import { IUser } from '../profile/profile.component'

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css', '../app.component.css']
})
export class UserCardComponent implements OnInit {

  @Input() public user: IUser
  public constructor() { }

  public ngOnInit(): void {
  }

}
