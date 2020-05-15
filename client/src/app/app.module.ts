import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BoardComponent} from './components/board/board.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ReactiveFormsModule} from '@angular/forms';
import {HomeComponent} from './components/home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {PopupComponent} from './components/popup/popup.component';
import {CreateRequestComponent} from './components/create-request/create-request.component';
import { AllRequestsComponent } from './components/all-requests/all-requests.component';
import {Ng5SliderModule} from 'ng5-slider';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    BoardComponent,
    HomeComponent,
    PopupComponent,
    CreateRequestComponent,
    AllRequestsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    DragDropModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng5SliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
