import { Component, OnInit } from '@angular/core'
import { backendURL } from '../../configurations/configuration'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css', '../app.component.css']
})
export class AboutComponent implements OnInit {

  public backendURL = backendURL
  public constructor() { }

  public ngOnInit(): void {
  }

}
