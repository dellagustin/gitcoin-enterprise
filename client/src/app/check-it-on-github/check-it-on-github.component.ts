import { Component, OnInit, Input } from '@angular/core'
import { ITask } from '../interfaces'

@Component({
  selector: 'app-check-it-on-github',
  templateUrl: './check-it-on-github.component.html',
  styleUrls: ['./check-it-on-github.component.css', '../app.component.css']
})
export class CheckItOnGithubComponent implements OnInit {

  @Input() public taskOfInterest: ITask
  public constructor() { }

  public ngOnInit(): void {
  }

}
