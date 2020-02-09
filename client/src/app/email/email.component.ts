import { Component, OnInit, Input } from '@angular/core'
import { IEmail } from '../interfaces'

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  @Input() eMail: IEmail

  constructor() { }

  ngOnInit(): void {

  }

}
