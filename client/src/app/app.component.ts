import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';


  public navBarData: INavbarData = this.getNavBarData();

  private getNavBarData(): INavbarData {
    return {
      // replace the following by your data...
      logoURL: 'https://fance-stiftung.de/api/app/app-images/logo.png',
      appTitle: 'App Title',
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
