import {Component, OnInit} from '@angular/core';
import {map, switchMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {TapeGql} from '../_gql';
import {Tape, User} from '../_models';
import {AuthenticationService} from '../_services';

@Component({templateUrl: 'tape.component.html'})
export class TapeComponent implements OnInit {

  public tape: Tape;
  public tapeSubscription: Subscription;
  public currentUser: User;

  constructor(
    private route: ActivatedRoute,
    private tapeGql: TapeGql,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.tapeSubscription = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          return this.tapeGql.watch(
            {
              tapeId: params.get('tapeId'),
              userId: this.currentUser.userId
            })
            .valueChanges
            .pipe(map(result => result.data.tape));
        })
      ).subscribe((tape: Tape) => {
        this.tape = tape;
      });
  }
}
