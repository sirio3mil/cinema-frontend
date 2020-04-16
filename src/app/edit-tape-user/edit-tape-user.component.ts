import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../_services';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({ templateUrl: 'edit-tape-user.component.html' })
export class EditTapeUserComponent implements OnInit {
  @Input() tapeId;
  @Input() userId;
  @Input() title;
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
    private alertService: AlertService,
    public activeModal: NgbActiveModal
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

  editTapeUser() {
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
