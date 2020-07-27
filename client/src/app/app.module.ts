import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BoardComponent} from './components/board/board.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HomeComponent} from './components/home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {PopupComponent} from './components/popup/popup.component';
import {CreateRequestComponent} from './components/create-request/create-request.component';
import {AllRequestsComponent} from './components/all-requests/all-requests.component';
import {Ng5SliderModule} from 'ng5-slider';
import {LogInComponent} from './components/log-in/log-in.component';
import {CandidateDetailsComponent} from './components/candidate-details/candidate-details.component';
import {RequestDetailComponent} from './components/request-detail/request-detail.component';
import {AddCandidateComponent} from './components/add-candidate/add-candidate.component';
import {StatisticsComponent} from './components/statistics/statistics.component';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {LogoutComponent} from './components/logout/logout.component';
import {CreateCandidateComponent} from './components/create-candidate/create-candidate.component';
import {WebDataRocksPivotComponent} from './webdatarocks/webdatarocks.angular4';
import {StatisticsProfilesComponent} from './components/statistics-profiles/statistics-profiles.component';
import {AlertModule} from "./components/alert/alert.module";

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    HomeComponent,
    PopupComponent,
    CreateRequestComponent,
    AllRequestsComponent,
    LogInComponent,
    CandidateDetailsComponent,
    RequestDetailComponent,
    AddCandidateComponent,
    StatisticsComponent,
    LogoutComponent,
    CreateCandidateComponent,
    WebDataRocksPivotComponent,
    StatisticsProfilesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    DragDropModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng5SliderModule,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
    AlertModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
