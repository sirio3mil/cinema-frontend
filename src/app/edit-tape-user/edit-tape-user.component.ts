import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertService, AuthenticationService, UserService} from '../_services';

@Component({ templateUrl: 'edit-tape-user.component.html' })
export class EditTapeUserComponent implements OnInit {
  editForm: FormGroup;
  loading = false;
  submitted = false;
  places = [
    {id: 1, name: 'AZ'}
  ];
  tapeUserStatuses = [
    {id: 1, name: 'AZ'}
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      tapeUserStatus: ['', Validators.required],
      place: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.editForm.controls; }

  onSubmit() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.editForm.invalid) {
      return;
    }
    this.loading = true;
  }
}
