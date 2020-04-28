import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService, AuthenticationService} from '../_services';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {SearchValue, User} from '../_models';
import {SearchGQL} from '../_gql';

@Component({ templateUrl: 'search.component.html' })
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  searching = false;
  submitted = false;
  searchValues$: Observable<SearchValue[]>;
  public currentUser: User;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private searchService: SearchGQL,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      pattern: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.searchForm.controls; }

  onSubmit() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.searchForm.invalid) {
      return;
    }
    this.searching = true;
    const variables = {
      pattern: this.f.pattern.value,
      rowType: 4,
      userId: this.currentUser.userId
    };
    this.searchValues$ = this.searchService.watch(variables)
      .valueChanges
      .pipe(map(result => {
        this.searching = false;
        this.submitted = false;
        return result.data.search;
      }));
  }
}
