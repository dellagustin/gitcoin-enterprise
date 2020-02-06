import { Component, OnInit } from '@angular/core'
import { BackendService } from '../backend.service'

export interface IUser {
  companyId: string
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
      companyId: '',
      firstName: '',
      balance: 0,
      link: '',
    }

    return user
  }


  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit(): void {
    this.users = this.backendService.getUsers()
  }

  public onUserIdEntered() {

    this.user = this.backendService.getUser(this.user.companyId)
    if (this.user === undefined) {
      alert('Please enter a valid user ID')
      this.user = ProfileComponent.getInitialUser()
    }

    ProfileComponent.currentUser = this.user
  }


}
