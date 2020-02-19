import { Injectable } from '@angular/core'
import { backendURL } from '../../configurations/configuration'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  public login(action: string) {
    const authenticationURL = `${backendURL}/authentication/login?action=${action}`
    location.assign(authenticationURL)
  }
}
