import { Component, OnInit, Input } from '@angular/core'
import { INavbarData } from './navbar/navbar.interfaces'
import { BackendService, ITask } from './backend.service'
import { ILedgerEntry } from './ledger/ledger.interface'
import { ActivatedRoute } from '@angular/router'
import { ProfileComponent, IUser } from './profile/profile.component'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public static deferredPrompt

  @Input() sessionWithoutCookieId = ''
  public mode = ''
  public fundedTasks: ITask[] = []
  public ledgerEntries: ILedgerEntry[] = []
  public navBarData: INavbarData = this.getNavBarData()
  public queryParameters: any
  public taskOfInterest: ITask

  public constructor(private readonly backendService: BackendService, private route: ActivatedRoute) { }
  public ngOnInit() {
    this.considerPWAInstallPrompt()
    this.getQueryParameterBasedData()
  }

  private getQueryParameterBasedData() {
    this.route
      .queryParamMap
      .subscribe((result: any) => {
        if (result.params !== undefined) {
          this.queryParameters = result.params
          if (this.queryParameters !== undefined) {
            if (this.queryParameters.id !== undefined) {
              this.backendService.getUser(this.queryParameters.id)
                .subscribe((user: IUser) => {
                  if (user === null || user === undefined) {
                    alert('Please enter a valid user ID')
                  } else {
                    ProfileComponent.currentUser = user
                  }
                })
            }
            if (this.queryParameters.taskId !== undefined) {
              this.backendService.getFundedTasks()
                .subscribe((fundedTasks: ITask[]) => {
                  this.fundedTasks = fundedTasks
                  this.taskOfInterest = this.fundedTasks.filter((entry: ITask) => entry.id === this.queryParameters.taskId)[0]
                  if (this.taskOfInterest === undefined) {
                    alert(`I could not find a task with the ID: ${this.queryParameters.taskId}`)
                  } else {
                    this.mode = 'viewSpecificTask'
                  }
                })
            }
          }
        }
      })
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
