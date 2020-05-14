import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from '../_services';
import {map, tap} from 'rxjs/operators';
import {TapeUser, User} from '../_models';
import {ListTapeUserGql} from '../_gql';
import {Observable} from 'rxjs';

@Component({templateUrl: 'downloaded.component.html'})
export class DownloadedComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('data') tapes: TapeUser[] = [];
  public currentUser: User;
  currentPage = 1;
  collection$: Observable<TapeUser[]>;
  totalItems = 0;
  itemsPerPage = 12;
  loading =  false;

  constructor(
    private listTapeUserGql: ListTapeUserGql,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.getPage(1);
  }

  getPage(page: number) {
    this.loading = true;
    const variables = {
      userId: this.currentUser.userId,
      tapeUserStatusId: 1,
      isTvShow: false,
      page,
      pageSize: this.itemsPerPage
    };
    this.collection$ = this.listTapeUserGql.watch(variables)
      .valueChanges
      .pipe(
      tap(res => {
        this.totalItems = res.data.listTapeUser.total;
        this.currentPage = page;
        this.loading = false;
      }),
      map(res => res.data.listTapeUser.elements)
    );
  }
}
