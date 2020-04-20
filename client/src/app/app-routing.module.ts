import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SignUpComponent} from './sign-up/sign-up.component';
import {BoardComponent} from './board/board.component';
import {HomeComponent} from "./home/home.component";


const routes: Routes = [
  {path: 'board', component: BoardComponent},
  {path: 'sign_up', component: SignUpComponent},
  {path: 'home', component: HomeComponent},

  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
