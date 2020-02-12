
import { RouterModule, Routes } from '@angular/router'
import { AppComponent } from './app.component'
import { FundComponent } from './fund/fund.component'

// I only need Routing for OAuth so far
export const appRoutes: Routes = [
  {
    path: 'loginsuccessful', component: FundComponent
  }
]
