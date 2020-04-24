import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../_services';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {EditSeasonUserGql, ListPlaceGQL, ListTapeUserStatusGQL} from '../_gql';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Place, TapeUser, TapeUserStatus} from '../_models';

@Component({ templateUrl: 'edit-season-user.component.html' })
export class EditSeasonUserComponent implements OnInit {
  @Input() tvShowId: number;
  @Input() userId: number;
  @Input() title: string;
  @Input() seasonNumber: number;
  editForm: FormGroup;
  loading = false;
  submitted = false;
  places$: Observable<Place[]>;
  tapeUserStatuses$: Observable<TapeUserStatus[]>;
  tapesUser: TapeUser[];

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private listPlaceGQL: ListPlaceGQL,
    private listTapeUserStatusGQL: ListTapeUserStatusGQL,
    private editSeasonUserGql: EditSeasonUserGql,
    public activeModal: NgbActiveModal
  ) {
  }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      tapeUserStatus: ['', Validators.required],
      place: ['', Validators.required]
    });
    const variables = {
      page: 1,
      pageSize: 20
    };
    this.places$ = this.listPlaceGQL.watch(variables)
      .valueChanges
      .pipe(map(result => result.data.listPlace.elements));
    this.tapeUserStatuses$ = this.listTapeUserStatusGQL.watch(variables)
      .valueChanges
      .pipe(map(result => result.data.listTapeUserStatus.elements));
  }

  // convenience getter for easy access to form fields
  get f() { return this.editForm.controls; }

  editSeasonUser() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.editForm.invalid) {
      return;
    }
    this.loading = true;
    const variables = {
      tvShowId: this.tvShowId,
      userId: this.userId,
      tapeUserStatusId: this.f.tapeUserStatus.value.tapeUserStatusId,
      placeId: this.f.place.value.placeId,
      season: this.seasonNumber
    };
    this.editSeasonUserGql.mutate(variables)
      .subscribe(result => {
        this.loading = false;
        this.submitted = false;
        this.tapesUser = result.data.editSeasonUser;
        this.activeModal.close(this.tapesUser);
      });
  }
}
