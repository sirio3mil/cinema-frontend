import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ListTapeUserGql } from '../_gql';
import { TapeUser, User } from '../_models';
import { AuthenticationService } from '../_services';

@Component({ templateUrl: 'tv-show.component.html' })
export class TvShowComponent implements OnInit, OnDestroy {
  private readonly currentUser: User;
  private subscriptions: Subscription[] = [];
  tapeUsers: TapeUser[];
  totalItems = 0;
  itemsPerPage = 16;
  loading = false;
  route = 'shows';
  currentPage = 1;

  constructor(
    private listTapeUserGql: ListTapeUserGql,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.getPage(1);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  getPage(page: number) {
    this.loading = true;
    const variables = {
      userId: this.currentUser.userId,
      tapeUserStatusId: 2,
      isTvShow: true,
      visible: true,
      finished: false,
      page,
      pageSize: this.itemsPerPage
    };
    this.subscriptions.push(this.listTapeUserGql.watch(variables)
    .valueChanges
    .pipe(
      tap(res => {
        this.totalItems = res.data.listTapeUser.total;
        this.currentPage = page;
        this.loading = false;
      }),
      map(res => res.data.listTapeUser.elements)
    )
    .subscribe((items: TapeUser[]) => {
      this.tapeUsers = items;
    }));
  }
}
