import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_helpers';
import { SearchComponent } from './search';
import {ImportImdbMovieComponent} from './import-imdb-movie';
import {ImportImdbEpisodeComponent} from './import-imdb-episode';
import {TapeComponent} from './tape';
import {TvShowComponent} from './tv-show';
import {LastSeenTapesComponent} from './last-seen-tapes';
import {ListTvShowChapterComponent} from './list-tv-show-chapter';
import {DownloadedComponent} from './downloaded';
import {SearchImageComponent} from './search-image';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'search-images/:title/:objectId', component: SearchImageComponent, canActivate: [AuthGuard] },
  { path: 'import-imdb-movie', component: ImportImdbMovieComponent, canActivate: [AuthGuard] },
  { path: 'last-seen-tapes', component: LastSeenTapesComponent, canActivate: [AuthGuard] },
  { path: 'downloaded', component: DownloadedComponent, canActivate: [AuthGuard] },
  { path: 'tv-show', component: TvShowComponent, canActivate: [AuthGuard] },
  { path: 'tv-show-chapter/:tvShowId/:season', component: ListTvShowChapterComponent, canActivate: [AuthGuard] },
  { path: 'import-imdb-episode/:imdbNumber', component: ImportImdbEpisodeComponent, canActivate: [AuthGuard] },
  { path: 'tape/:tapeId', component: TapeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
