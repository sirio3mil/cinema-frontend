import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService, LastSeenTapesService} from '../_services';
import {map} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {TapeUser, User} from '../_models';
import {ListTapeUserGql} from '../_gql';

@Component({templateUrl: 'last-seen-tapes.component.html'})
export class LastSeenTapesComponent implements OnInit, OnDestroy {
  private readonly currentUser: User;
  tapeUsers: TapeUser[];
  private subscriptions: Subscription[] = [];

  constructor(
    private listTapeUserGql: ListTapeUserGql,
    private authenticationService: AuthenticationService,
    private lastSeenTapesService: LastSeenTapesService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.tapeUsers = this.lastSeenTapesService.subscribed;
  }

  ngOnInit() {
    this.load();
  }

  private load() {
    const variables = {
      userId: this.currentUser.userId,
      tapeUserStatusId: 2,
      isTvShow: false,
      page: 1,
      pageSize: 50
    };
    this.subscriptions.push(this.listTapeUserGql.watch(variables)
      .valueChanges
      .pipe(map(result => result.data.listTapeUser.elements))
      .subscribe((items: TapeUser[]) => {
        this.tapeUsers = items;
        this.lastSeenTapesService.save(items);
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
