import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService, TvShowService} from '../_services';
import {map} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {TapeUser, User} from '../_models';
import {ListTapeUserGql} from '../_gql';

@Component({templateUrl: 'tv-show.component.html'})
export class TvShowComponent implements OnInit, OnDestroy {
  private readonly currentUser: User;
  private subscriptions: Subscription[] = [];
  tapeUsers: TapeUser[];

  constructor(
    private listTapeUserGql: ListTapeUserGql,
    private authenticationService: AuthenticationService,
    private tvShowService: TvShowService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.tapeUsers = this.tvShowService.subscribed;
  }

  ngOnInit() {
    if (!this.tapeUsers) {
      this.load();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private load() {
    const variables = {
      userId: this.currentUser.userId,
      tapeUserStatusId: 2,
      isTvShow: true,
      visible: true,
      finished: false,
      page: 1,
      pageSize: 50
    };
    this.subscriptions.push(this.listTapeUserGql.watch(variables)
      .valueChanges
      .pipe(map(result => result.data.listTapeUser.elements))
      .subscribe((items: TapeUser[]) => {
        this.tapeUsers = items;
        this.tvShowService.save(items);
      }));
  }
}
