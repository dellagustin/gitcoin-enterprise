import { Component } from '@angular/core'
import { backendURL } from '../../configurations/configuration'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css', '../app.component.css'],
})
export class AboutComponent {

  public backendURL = backendURL

}
