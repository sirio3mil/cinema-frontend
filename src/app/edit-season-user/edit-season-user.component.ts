import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AlertService, AuthenticationService} from '../_services';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {EditSeasonUserGql} from '../_gql';
import {TapeUser, User} from '../_models';

@Component({templateUrl: 'edit-season-user.component.html'})
export class EditSeasonUserComponent {
  @Input() tvShowId: number;
  @Input() title: string;
  @Input() seasonNumber: number;
  editForm: FormGroup;
  loading = false;
  submitted = false;
  tapesUser: TapeUser[];
  public currentUser: User;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private editSeasonUserGql: EditSeasonUserGql,
    public activeModal: NgbActiveModal,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.editForm = this.formBuilder.group({
      tapeUserStatus: [],
      place: []
    });
  }

  get f() {
    return this.editForm.controls;
  }

  editSeasonUser() {
    this.submitted = true;
    this.alertService.clear();
    if (this.editForm.invalid) {
      return;
    }
    this.loading = true;
    const variables = {
      tvShowId: this.tvShowId,
      userId: this.currentUser.userId,
      tapeUserStatusId: this.f.tapeUserStatus.value.tapeUserStatus.tapeUserStatusId,
      placeId: this.f.place.value.place.placeId,
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
