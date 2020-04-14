import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertService, AuthenticationService, SearchResult, SearchService, UserService} from '../_services';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({ templateUrl: 'search.component.html' })
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  searching = false;
  submitted = false;
  results: Observable<SearchResult[]>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private searchService: SearchService
  ) {
    // redirect to home if already logged in
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
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
      pattern: this.f.pattern,
      rowType: 4,
      userId: 1
    };
    this.results = this.searchService.watch(variables)
      .valueChanges
      .pipe(map(result => result.data.results));
  }
}
