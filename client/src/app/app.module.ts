import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BoardComponent } from './components/board/board.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './components/home/home.component';
import {HttpClientModule} from "@angular/common/http";
import { PopupComponent } from './components/popup/popup.component';
import { ListRequests } from './components/list-requests/list-requests.component.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    BoardComponent,
    HomeComponent,
    PopupComponent,
    ListRequests.ComponentComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        BrowserAnimationsModule,
        DragDropModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
