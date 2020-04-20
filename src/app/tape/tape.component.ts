import {Component, OnInit} from '@angular/core';
import {AlertService} from '../_services';
import {map, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {TapeGql} from '../_gql';
import {Tape} from '../_models';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

@Component({templateUrl: 'tape.component.html'})
export class TapeComponent implements OnInit {
  tape$: Observable<Tape>;
  tapeId$: Observable<string>;

  faSpinner = faSpinner;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private tapeGql: TapeGql
  ) {
  }

  ngOnInit() {
    this.tapeId$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => params.get('tapeId'))
    );
    const variables = {
      tapeId: this.tapeId$,
      userId: 1
    };
    this.tape$ = this.tapeGql.watch(variables)
      .valueChanges
      .pipe(map(result => result.data.tape));
  }
}
