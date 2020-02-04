import { Component } from '@angular/core';
import { INavbarData } from 'ng-responsive-navbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'client';
  public mode = '';
  public navBarData: INavbarData = this.getNavBarData();

  public fundTask() {
    this.mode = 'fund';
  }

  public solveTask() {
    this.mode = 'solve';
  }



  private getNavBarData(): INavbarData {
    return {
      logoURL: '',
      appTitle: 'GitCoin Enterprise',
      menuEntries: [{
        isActive: true,
        text: 'Fund an Issue',
        href: '/fund',
      },
      {
        isActive: false,
        text: 'Solve an Issue',
        href: '/solve',
      },
      {
        isActive: false,
        text: 'About',
        href: '/about',
      },
      {
        isActive: false,
        text: 'Contact',
        href: '/contact',
      }
      ]
    };
  }

  public onClickMenuEntry(target: string) {
    alert(target);
  }
}
