import { Component, OnInit, Input } from '@angular/core'
import { BackendService } from '../backend.service'
import { backendURL } from '../../configurations/configuration'
import { IUser } from '../interfaces'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../app.component.css']
})
export class ProfileComponent implements OnInit {

  public userIsAuthenticated = (BackendService.authenticationToken === '') ? false : true
  public users: IUser[] = []
  public userIsAuthorized = false
  // public user = ProfileComponent.currentUser

  public static getInitialUser() {
    const user: IUser = {
      avatarURL: 'https://avatars1.githubusercontent.com/u/43786652?v=4',
      balance: 0,
      link: '',
    }

    return user
  }

  public login() {
    window.location.assign(`${backendURL}/login`)
  }


  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit(): void {
  alert('https://avatars1.githubusercontent.com/u/43786652?v=4')
    // this.backendService.getUsers()
    //   .subscribe((result: IUser[]) => this.users = result )
  }

  public clickBountiesAndFundings() {
    alert('to be developed')
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
