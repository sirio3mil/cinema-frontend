import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {JwtInterceptor, ErrorInterceptor} from './_helpers';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {RegisterComponent} from './register';
import {AlertComponent} from './alert';
import {GraphQLModule} from './graphql.module';
import {SearchComponent} from './search';
import {ImportImdbMovieComponent} from './import-imdb-movie';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {EditTapeUserComponent} from './edit-tape-user';
import {ImportImdbEpisodeComponent} from './import-imdb-episode';
import {TapeComponent} from './tape';
import {EditSeasonUserComponent} from './edit-season-user';
import {TvShowComponent} from './tv-show';
import {LastSeenTapesComponent} from './last-seen-tapes';
import {ListTvShowChapterComponent} from './list-tv-show-chapter';
import {TapeListCardComponent} from './tape-list-card';
import {TapeUserStatusComponent} from './tape-user-status';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AlertComponent,
    SearchComponent,
    ImportImdbMovieComponent,
    ImportImdbEpisodeComponent,
    EditSeasonUserComponent,
    EditTapeUserComponent,
    TapeComponent,
    TvShowComponent,
    LastSeenTapesComponent,
    ListTvShowChapterComponent,
    TapeListCardComponent,
    TapeUserStatusComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    GraphQLModule,
    FontAwesomeModule,
    NgbModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
