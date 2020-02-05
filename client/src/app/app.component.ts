import { Component } from '@angular/core'
import { INavbarData } from 'ng-responsive-navbar'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public mode = ''
  public navBarData: INavbarData = this.getNavBarData()

  public fundTask() {
    this.mode = 'fund'
  }

  public solveTask() {
    this.mode = 'solve'
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

  public onClickMenuEntry(target: string) {
    this.mode = target
    if (this.mode === 'openSource') {
      window.location.assign('https://github.com/gitcoin-enterprise/gitcoin-enterprise')
    }
  }
}
