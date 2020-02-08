
import { LedgerComponent } from './ledger/ledger.component'
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { ServiceWorkerModule } from '@angular/service-worker'
import { environment } from '../environments/environment'
import { AboutComponent } from './about/about.component'
import { FundComponent } from './fund/fund.component'
import { SolveComponent } from './solve/solve.component'
import { ContactComponent } from './contact/contact.component'
import { ButtonsModule } from 'ngx-bootstrap/buttons'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { ProfileComponent } from './profile/profile.component'
import { InviteFriendComponent } from './invite-friend/invite-friend.component'
import { TaskCardComponent } from './task-card/task-card.component'
import { UserCardComponent } from './user-card/user-card.component'
import { NavbarComponent } from './navbar/navbar.component'
import { ScrollingModule } from '@angular/cdk/scrolling'
import { EmailComponent } from './email/email.component'
import { RouterModule } from '@angular/router'
import { CheckItOnGithubComponent } from './check-it-on-github/check-it-on-github.component'

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    FundComponent,
    SolveComponent,
    ContactComponent,
    ProfileComponent,
    LedgerComponent,
    InviteFriendComponent,
    TaskCardComponent,
    UserCardComponent,
    NavbarComponent,
    EmailComponent,
    CheckItOnGithubComponent

  ],
  imports: [
    RouterModule.forRoot([]),
    ScrollingModule,
    HttpClientModule,
    FormsModule,
    ButtonsModule.forRoot(),
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
