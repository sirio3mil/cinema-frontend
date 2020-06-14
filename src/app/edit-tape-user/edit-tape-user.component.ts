import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AlertService, AuthenticationService} from '../_services';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {EditTapeUserGql} from '../_gql';
import {TapeUser, User, WishList} from '../_models';

@Component({templateUrl: 'edit-tape-user.component.html'})
export class EditTapeUserComponent {
  @Input() tapeId: number;
  @Input() title: string;
  editForm: FormGroup;
  loading = false;
  submitted = false;
  private tapeUser: TapeUser;
  private readonly currentUser: User;
  private tapeUserStatusDownloaded = 1;
  private tapeUserStatusWishListed = 3;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private editTapeUserService: EditTapeUserGql,
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

  editTapeUser() {
    this.submitted = true;
    this.alertService.clear();
    if (this.editForm.invalid) {
      return;
    }
    this.loading = true;
    const tapeUserStatusId = +this.f.tapeUserStatus.value.tapeUserStatus.tapeUserStatusId;
    const placeId = +this.f.place.value.place.placeId;
    const variables = {
      tapeId: this.tapeId,
      userId: this.currentUser.userId,
      tapeUserStatusId,
      placeId
    };
    this.editTapeUserService.mutate(variables)
      .subscribe(result => {
        this.loading = false;
        this.submitted = false;
        this.tapeUser = result.data.editTapeUser;
        switch (tapeUserStatusId) {
          case this.tapeUserStatusWishListed:
            const waldo = {
              tape: this.tapeUser.tape,
              tapeUser: this.tapeUser
            } as WishList;
            this.currentUser.wishList.push(waldo);
            this.authenticationService.save(this.currentUser);
            break;
          case this.tapeUserStatusDownloaded:
            break;
        }
        this.activeModal.close(this.tapeUser);
      });
  }
}
