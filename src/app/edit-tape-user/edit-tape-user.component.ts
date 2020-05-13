import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AlertService, AuthenticationService} from '../_services';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {EditTapeUserGql} from '../_gql';
import {TapeUser, User} from '../_models';

@Component({templateUrl: 'edit-tape-user.component.html'})
export class EditTapeUserComponent {
    @Input() tapeId: number;
    @Input() title: string;
    editForm: FormGroup;
    loading = false;
    submitted = false;
    tapeUser: TapeUser;
    public currentUser: User;

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
        const variables = {
            tapeId: this.tapeId,
            userId: this.currentUser.userId,
            tapeUserStatusId: this.f.tapeUserStatus.value.tapeUserStatus.tapeUserStatusId,
            placeId: this.f.place.value.place.placeId
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
