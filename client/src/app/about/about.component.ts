import { Component } from '@angular/core'
import { BackendService } from '../backend.service'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css', '../app.component.css'],
})
export class AboutComponent {

  public backendURL = BackendService.backendURL

}
