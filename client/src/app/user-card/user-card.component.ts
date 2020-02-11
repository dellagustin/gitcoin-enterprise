import { Component, Input } from '@angular/core'
import { IUser } from '../profile/profile.component'

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css', '../app.component.css']
})
export class UserCardComponent {

  @Input() public user: IUser

}
