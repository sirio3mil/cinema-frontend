import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertService, AuthenticationService, ImportImdbMovieService, UserService} from '../_services';
import {Tape} from '../_models';

@Component({ templateUrl: 'import-imdb-movie.component.html' })
export class ImportImdbMovieComponent implements OnInit {
  importForm: FormGroup;
  importing = false;
  submitted = false;
  tape: Tape;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private importImdbMovieService: ImportImdbMovieService
  ) {
  }

  ngOnInit() {
    this.importForm = this.formBuilder.group({
      imdbNumber: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.importForm.controls; }

  onSubmit() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.importForm.invalid) {
      return;
    }
    this.importing = true;
    const variables = {
      imdbNumber: this.f.imdbNumber.value
    };
    this.importImdbMovieService.mutate(variables)
      .subscribe(result => {
        this.importing = false;
        this.submitted = false;
        this.tape = result.data.importImdbMovie;
      });
  }
}
