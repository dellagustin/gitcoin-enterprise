import { Component } from '@angular/core';
import { INavbarData } from 'ng-responsive-navbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'client';
  public mode = 'about';
  public navBarData: INavbarData = this.getNavBarData();

  public fundTask() {
    this.mode = 'fund';
  }

  public solveTask() {
    this.mode = 'solve';
  }



  private getNavBarData(): INavbarData {
    return {
      logoURL: 'https://fance-stiftung.de/api/app/app-images/logo.png',
      appTitle: 'GitCoin Enterprise',
      menuEntries: [{
        isActive: true,
        text: 'Menu Entry 1',
        href: '/menuEntry1',
      },
      {
        isActive: false,
        text: 'Menu Entry 2',
        href: '/menuEntry2',
      },
      {
        isActive: false,
        text: 'Menu Entry 3',
        href: '/menuEntry3',
      }]
    };
  }

  public onClickMenuEntry(target: string) {
    alert(target);
  }
}
