import {Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {TapeUser, User} from '../_models';
import {AuthenticationService} from '../_services';
import {Observable} from 'rxjs';
import {ListTapeUserGql} from '../_gql';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
  currentUser: User;
  tapesUser$: Observable<TapeUser[]>;

  constructor(
    private authenticationService: AuthenticationService,
    private listTapeUserGql: ListTapeUserGql
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
