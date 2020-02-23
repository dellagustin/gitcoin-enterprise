import { Component, OnInit } from '@angular/core'
import { INavbarData } from './navbar/navbar.interfaces'
import { ILedgerEntry } from './ledger/ledger.interface'
import { IAuthenticationData, ITask } from './interfaces'
import { ActivatedRoute } from '@angular/router'
import { backendURL } from '../configurations/configuration'
import { NavBarProvider } from './navbar/navbar.provider'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public static deferredPrompt: any

  public authenticationData: IAuthenticationData
  public newLedgerEntry: ILedgerEntry
  public sessionWithoutCookies = ''
  public mode = 'landing'
  public viewTransactionInLedger = false
  public fundedTasks: ITask[] = []
  public ledgerEntries: ILedgerEntry[] = []
  public navBarData: INavbarData = NavBarProvider.getNavBarData()
  public queryParameters: any
  public taskOfInterest: ITask
  private params: any
  private readonly modesRequiringAuthentication: string[] = ['fund', 'solve', 'profile', 'downloadLedger']

  public constructor(private readonly aR: ActivatedRoute) { }

  public ngOnInit() {
    this.considerPWAInstallPrompt()

    this.aR
      .queryParamMap
      .subscribe((result: any) => {
        if (result.params !== undefined && result.params.actionID !== undefined) {
          this.mode = result.params.actionID
          this.params = { ...result.params } // perhaps not necessary
          history.replaceState(null, null, ' ')
          this.authenticationData = {
            login: this.params.login,
            avatarURL: this.params.avatarURL,
            token: this.params.authenticationToken
          }
        }
      })
  }

  public fundTask() {
    // alert(this.authenticationData.login)
    if (this.authenticationData === undefined) {
      location.assign(`${backendURL}/authentication/login?action=fund`)
    } else {
      this.mode = 'fund'
    }
  }

  public solveTask() {
    // alert(this.authenticationData.login)
    if (this.authenticationData === undefined) {
      location.assign(`${backendURL}/authentication/login?action=solve`)
    } else {
      this.mode = 'solve'
    }
  }

  public onClickMenuEntry(target: string) {
    if (this.modesRequiringAuthentication.indexOf(target) !== -1 && this.authenticationData === undefined) {
      location.assign(`${backendURL}/authentication/login?action=${target}`)
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

  public onViewTransactionInLedger(newLedgerEntry: ILedgerEntry) {
    this.newLedgerEntry = newLedgerEntry
    this.viewTransactionInLedger = true
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

}
