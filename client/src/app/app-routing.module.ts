import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './components/board/board.component';
import { HomeComponent } from './components/home/home.component';
import { CreateRequestComponent } from './components/create-request/create-request.component';
import {AllRequestsComponent} from './components/all-requests/all-requests.component';
import {LogInComponent} from './components/log-in/log-in.component';
import {CandidateDetailsComponent} from './components/candidate-details/candidate-details.component';
import {RequestDetailComponent} from './components/request-detail/request-detail.component';
import {StatisticsComponent} from './components/statistics/statistics.component';
import {MatOptionModule} from '@angular/material/core';
import {AuthGuardService} from './services/guard/auth-guard/auth-guard.service';
import {LogoutComponent} from './components/logout/logout.component';
import {CreateCandidateComponent} from './components/create-candidate/create-candidate.component';
import {SearchCandidateComponent} from './components/search-candidate/search-candidate.component';
import {AnonymousGuardService} from './services/guard/anonymous-guard/anonymous-guard.service';
import {DashboardComponent} from './components/dashboard/dashboard.component';


const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'home', component: HomeComponent, canActivate: [AnonymousGuardService]},
  {path: 'log-in', component: LogInComponent, canActivate: [AnonymousGuardService]},
  {path: 'board', component: BoardComponent, canActivate: [AuthGuardService]},
  {path: 'create-request', component: CreateRequestComponent, canActivate: [AuthGuardService]},
  {path: 'all-requests', component: AllRequestsComponent, canActivate: [AuthGuardService]},
  {path: 'candidates/:id', component: CandidateDetailsComponent, canActivate: [AuthGuardService]},
  {path: 'request-detail/:requestId ', component: RequestDetailComponent, canActivate: [AuthGuardService]},
  {path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuardService]},
  {path: 'logout', component: LogoutComponent, canActivate: [AuthGuardService]},
  {path: 'create-candidate', component: CreateCandidateComponent, canActivate: [AuthGuardService]},
  {path: 'search-candidate', component: SearchCandidateComponent, canActivate: [AuthGuardService]},
  // otherwise redirect to home
  {path: '**', redirectTo: 'home'}
  // TODO -> Page Not Found Component instead of redirecting to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes), MatOptionModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
