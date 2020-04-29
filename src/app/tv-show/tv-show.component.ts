import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../_services';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {TapeUser, User} from '../_models';
import {ListTapeUserGql} from '../_gql';

@Component({ templateUrl: 'tv-show.component.html' })
export class TvShowComponent implements OnInit {
  public currentUser: User;
  tapesUser$: Observable<TapeUser[]>;

  constructor(
    private listTapeUserGql: ListTapeUserGql,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    const variables = {
      userId: this.currentUser.userId,
      tapeUserStatusId: 2,
      isTvShow: true,
      visible: true,
      finished: false,
      page: 1,
      pageSize: 50
    };
    this.tapesUser$ = this.listTapeUserGql.watch(variables)
      .valueChanges
      .pipe(map(result => result.data.listTapeUser.elements));
  }
}
