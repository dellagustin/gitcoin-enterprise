import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { INavbarData } from './navbar.interfaces'
import { backendURL } from '../../configurations/configuration'


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css', '../app.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() navBarData: INavbarData
  @Output() clickMenuEntry = new EventEmitter<string>()
  public readyForPrompt: boolean

  public ngOnInit() {
    // alert(this.navBarData.logoURL);
  }

  public clickEntry(target: string): void {
    this.myFunction()
    for (const entry of this.navBarData.menuEntries) {
      if (entry.href === target) {
        entry.isActive = true
      } else {
        entry.isActive = false
      }
    }

    this.clickMenuEntry.emit(target)
  }

  public myFunction(): void {
    const x = document.getElementById('myTopnav')
    if (x.className === 'topnav') {
      x.className += ' responsive'
    } else {
      x.className = 'topnav'
    }
  }

  public clickTitle() {
    window.location.assign(backendURL)
  }
}
