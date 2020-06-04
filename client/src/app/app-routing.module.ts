import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {BoardComponent} from './components/board/board.component';
import {HomeComponent} from './components/home/home.component';
import {CreateRequestComponent} from './components/create-request/create-request.component';
import {AllRequestsComponent} from './components/all-requests/all-requests.component';
import {LogInComponent} from './components/log-in/log-in.component';
import {CandidateDetailsComponent} from './components/candidate-details/candidate-details.component';
import { RequestDetailComponent } from './components/request-detail/request-detail.component';


const routes: Routes = [
  {path: 'board', component: BoardComponent},
  {path: 'create-request', component: CreateRequestComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'home', component: HomeComponent},
  {path: 'all-requests', component: AllRequestsComponent},
  {path: 'log-in', component: LogInComponent},
  {path: 'candidate/:id', component: CandidateDetailsComponent},
  { path: 'request-detail/:requestId ', component: RequestDetailComponent },
  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
