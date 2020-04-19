import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SignUpComponent} from './sign-up/sign-up.component';
import {BoardComponent} from './board/board.component';


const routes: Routes = [{path: 'board', component: BoardComponent}, {path: 'signup', component: SignUpComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
