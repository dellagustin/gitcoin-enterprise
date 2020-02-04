import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { NavbarModule } from 'ng-responsive-navbar'
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
@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    FundComponent,
    SolveComponent,
    ContactComponent,
    ProfileComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    ButtonsModule.forRoot(),
    NavbarModule,
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
