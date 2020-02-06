import { Component, OnInit } from '@angular/core'
import { BackendService } from '../backend.service'

export interface IUser {
  id: string
  firstName: string
  balance: number
  link: string
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../app.component.css']
})
export class ProfileComponent implements OnInit {

  public static currentUser: IUser = ProfileComponent.getInitialUser()
  public users: IUser[] = []
  public user = ProfileComponent.currentUser

  public static getInitialUser() {
    const user: IUser = {
      id: '',
      firstName: '',
      balance: 0,
      link: '',
    }

    return user
  }


  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit(): void {
    // this.backendService.getUsers()
    //   .subscribe((result: IUser[]) => this.users = result )
  }

  public onUserIdEntered() {

    this.backendService.getUser(this.user.id)
      .subscribe((user: IUser) => {
        if (user === undefined) {
          alert('Please enter a valid user ID')
        } else {
          this.user = user
          ProfileComponent.currentUser = this.user
        }
      }, error => alert(error.message))
  }


}
