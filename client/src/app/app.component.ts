import { Component, OnInit } from '@angular/core'
import { INavbarData } from './navbar/navbar.interfaces'
import { BackendService } from './backend.service'
import { ILedgerEntry } from './ledger/ledger.interface'
import { backendURL } from '../configurations/configuration'
import { IAuthenticationData, ITask } from './interfaces'
// import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public static deferredPrompt

  public authenticationData: IAuthenticationData
  public sessionWithoutCookies = ''
  public mode = ''
  public fundedTasks: ITask[] = []
  public ledgerEntries: ILedgerEntry[] = []
  public navBarData: INavbarData = this.getNavBarData()
  public queryParameters: any
  public taskOfInterest: ITask
  public action

  private readonly modesRequiringAuthentication: string[] = ['fund', 'solve']


  // public constructor(private readonly backendService: BackendService, private route: ActivatedRoute) { }
  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit() {
    this.considerPWAInstallPrompt()

    try {
      this.action = document.getElementById('actionID').innerHTML.trim()
    } catch (error) {
      console.log(`accessing data from document failed ${error.message}`)
    }

    if (this.action !== 'actionsForRedirectingConvenientlyAfterLogin') {
      this.authenticationData.login = document.getElementById('login').innerHTML.trim()
      this.authenticationData.avatarURL = document.getElementById('avatarURL').innerHTML.trim()
      this.authenticationData.token = document.getElementById('authenticationToken').innerHTML.trim()
    }
    this.mode = (this.action === 'actionsForRedirectingConvenientlyAfterLogin') ? '' : this.action
  }

  public fundTask() {
    // alert(this.authenticationData.login)
    if (this.authenticationData === undefined) {
      this.loginViaGitHub('fund')
    } else {
      this.mode = 'fund'
    }
  }

  public solveTask() {
    // alert(this.authenticationData.login)
    if (this.authenticationData === undefined) {
      this.loginViaGitHub('solve')
    } else {
      this.mode = 'solve'
    }
  }

  private loginViaGitHub(action: string) {
    const authenticationURL = `${backendURL}/authentication/login?action=${action}`
    location.assign(authenticationURL)
  }

  public onClickMenuEntry(target: string) {
    if (this.modesRequiringAuthentication.indexOf(target) !== -1 && this.authenticationData === undefined) {
      this.loginViaGitHub(target)
    } else {
      this.mode = target
      if (this.mode === 'openSource') {
        window.location.assign('https://github.com/gitcoin-enterprise/gitcoin-enterprise')
      } else if (this.mode === 'useAsApp') {
        this.mode = ''
        this.useAsPWA()
      }
    }
  }

  private useAsPWA() {
    setTimeout(() => {
      if (AppComponent.deferredPrompt === undefined) {
        alert('To use the App Version please click the Share Button at the bottom of your browser and click "Add to Homescreen".')
      } else {
        AppComponent.deferredPrompt.prompt()
        AppComponent.deferredPrompt.userChoice.then(choiceResult => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt')
          } else {
            console.log('User dismissed the A2HS prompt')
          }
          AppComponent.deferredPrompt = null
        })
      }
    }, 1 * 1000)

  }

  private considerPWAInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault()
      AppComponent.deferredPrompt = event
    })
  }

  private getNavBarData(): INavbarData {
    return {
      logoURL: '../assets/peer-2-peer.jpg',
      appTitle: 'GitCoin Enterprise',
      menuEntries: [
        {
          isActive: true,
          text: 'Home',
          href: '',
        },
        {
          isActive: false,
          text: 'Fund a Task',
          href: 'fund',
        },
        {
          isActive: false,
          text: 'Solve a Task',
          href: 'solve',
        },
        {
          isActive: false,
          text: 'Profile',
          href: 'profile',
        },
        {
          isActive: false,
          text: 'Ledger',
          href: 'downloadLedger',
        },
        {
          isActive: false,
          text: 'Use as App',
          href: 'useAsApp',
        },
        {
          isActive: false,
          text: 'Invite Friends',
          href: 'inviteFriends',
        },
        {
          isActive: false,
          text: 'Open Source',
          href: 'openSource',
        },
        {
          isActive: false,
          text: 'About',
          href: 'about',
        },
        {
          isActive: false,
          text: 'Contact',
          href: 'contact',
        }
      ]
    }
  }
}
