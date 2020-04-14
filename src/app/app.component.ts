import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AlertService, AuthenticationService, SearchResult, SearchService} from './_services';
import { User } from './_models';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cinema-frontend';
  currentUser: User;
  searchForm: FormGroup;
  searching = false;
  submitted = false;
  results: Observable<SearchResult[]>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private searchService: SearchService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.searchForm = this.formBuilder.group({
      pattern: ['', Validators.required]
    });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
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
    this.results = this.searchService.watch({
      pattern: this.f.pattern
    })
      .valueChanges
      .pipe(
        map(result => {
          this.searching = false;
          this.submitted = false;
          return result.data.results;
        })
      );
  }
}
