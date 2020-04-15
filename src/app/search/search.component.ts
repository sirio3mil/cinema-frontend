import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../_services';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {SearchValue} from '../_models';
import {SearchGQL} from '../_gql';

@Component({ templateUrl: 'search.component.html' })
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  searching = false;
  submitted = false;
  results: Observable<SearchValue[]>;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private searchService: SearchGQL
  ) {
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
      userId: 1
    };
    this.results = this.searchService.watch(variables)
      .valueChanges
      .pipe(map(result => {
        this.searching = false;
        this.submitted = false;
        return result.data.search;
      }));
  }
}
