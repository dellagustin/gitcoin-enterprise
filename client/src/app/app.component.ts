import { Component, OnInit } from '@angular/core'
import { INavbarData } from './navbar/navbar.interfaces'
import { BackendService, ITask } from './backend.service'
import { ILedgerEntry } from './ledger/ledger.interface'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public static deferredPrompt
  public mode = ''
  public fundedTasks: ITask[] = []
  public ledgerEntries: ILedgerEntry[] = []
  public navBarData: INavbarData = this.getNavBarData()

  public constructor(private readonly backendService: BackendService) { }
  public ngOnInit() {
    this.considerPWAInstallPrompt()
    this.getFundedTasks()
    this.getLedgerEntries()
  }

  private getFundedTasks() {
    this.backendService.getFundedTasks()
      .subscribe((result: ITask[]) => this.fundedTasks = result)
  }

  private getLedgerEntries() {
    this.backendService.getLedgerEntries()
      .subscribe((result: ILedgerEntry[]) => this.ledgerEntries = result)
  }

  public fundTask() {
    this.mode = 'fund'
  }

  public solveTask() {
    this.mode = 'solve'
  }



  public onClickMenuEntry(target: string) {
    this.mode = target
    if (this.mode === 'openSource') {
      window.location.assign('https://github.com/gitcoin-enterprise/gitcoin-enterprise')
    } else if (this.mode === 'useAsApp') {
      this.mode = ''
      this.useAsPWA()
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
          text: 'Fund an Issue',
          href: 'fund',
        },
        {
          isActive: false,
          text: 'Solve an Issue',
          href: 'solve',
        },
        {
          isActive: false,
          text: 'Profile',
          href: 'profile',
        },
        {
          isActive: false,
          text: 'Download Ledger',
          href: 'downloadLedger',
        },
        {
          isActive: false,
          text: 'Invite Friends',
          href: 'inviteFriends',
        },
        {
          isActive: false,
          text: 'Use as App',
          href: 'useAsApp',
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
