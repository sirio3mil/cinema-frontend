import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../_services';
import {map, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {TapeUser, User} from '../_models';
import {ListTapeUserGql} from '../_gql';

@Component({templateUrl: 'last-seen-tapes.component.html'})
export class LastSeenTapesComponent implements OnInit, OnDestroy {
  private readonly currentUser: User;
  currentPage = 1;
  private subscriptions: Subscription[] = [];
  tapeUsers: TapeUser[];
  totalItems = 0;
  itemsPerPage = 16;
  loading =  false;
  route = 'seen';

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
      isTvShow: false,
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
