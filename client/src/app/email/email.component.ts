import { Component, OnInit, Input } from '@angular/core'

export interface IEmail {
  sender: string,
  recipient: string,
  subject: string
  content: string
}
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
