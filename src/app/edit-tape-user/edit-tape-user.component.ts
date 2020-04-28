import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService, AuthenticationService} from '../_services';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {EditTapeUserGql, ListPlaceGQL, ListTapeUserStatusGQL} from '../_gql';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Place, TapeUser, TapeUserStatus, User} from '../_models';

@Component({ templateUrl: 'edit-tape-user.component.html' })
export class EditTapeUserComponent implements OnInit {
  @Input() tapeId: number;
  @Input() title: string;
  editForm: FormGroup;
  loading = false;
  submitted = false;
  places$: Observable<Place[]>;
  tapeUserStatuses$: Observable<TapeUserStatus[]>;
  tapeUser: TapeUser;
  public currentUser: User;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private listPlaceService: ListPlaceGQL,
    private listTapeUserStatusService: ListTapeUserStatusGQL,
    private editTapeUserService: EditTapeUserGql,
    public activeModal: NgbActiveModal,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
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
    this.places$ = this.listPlaceService.watch(variables)
      .valueChanges
      .pipe(map(result => result.data.listPlace.elements));
    this.tapeUserStatuses$ = this.listTapeUserStatusService.watch(variables)
      .valueChanges
      .pipe(map(result => result.data.listTapeUserStatus.elements));
  }

  // convenience getter for easy access to form fields
  get f() { return this.editForm.controls; }

  editTapeUser() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.editForm.invalid) {
      return;
    }
    this.loading = true;
    const variables = {
      tapeId: this.tapeId,
      userId: this.currentUser.userId,
      tapeUserStatusId: this.f.tapeUserStatus.value.tapeUserStatusId,
      placeId: this.f.place.value.placeId
    };
    this.editTapeUserService.mutate(variables)
      .subscribe(result => {
        this.loading = false;
        this.submitted = false;
        this.tapeUser = result.data.editTapeUser;
        this.activeModal.close(this.tapeUser);
      });
  }
}
