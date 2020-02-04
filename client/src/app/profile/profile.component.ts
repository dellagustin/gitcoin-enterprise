import { Component, OnInit } from '@angular/core';

export interface IUser {
  companyId: string;
  firstName: string;
  balance: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../app.component.css']
})
export class ProfileComponent implements OnInit {

  public user = ProfileComponent.getInitialUser()
  constructor() { }

  public static getInitialUser() {
    const user: IUser = {
      companyId: 'd123456',
      firstName: 'Michael',
      balance: '2000',
    };

    return user;
  }
  ngOnInit(): void {
  }

}
