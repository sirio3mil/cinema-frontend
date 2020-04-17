import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../_services';
import {TvShowChapter} from '../_models';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ImportImdbEpisodeGql} from '../_gql';

@Component({templateUrl: 'import-imdb-episode.component.html'})
export class ImportImdbEpisodeComponent implements OnInit {

  importing = false;
  submitted = false;

  importForm: FormGroup;
  imdbNumber$: Observable<string>;
  tvShowChapters: TvShowChapter[];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private imdbEpisodeGql: ImportImdbEpisodeGql
  ) {
  }

  ngOnInit() {
    this.importForm = this.formBuilder.group({
      seasonNumber: ['', Validators.required]
    });
    this.imdbNumber$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => params.get('imdbNumber'))
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.importForm.controls;
  }

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
      imdbNumber: +this.imdbNumber$,
      seasonNumber: this.f.seasonNumber.value
    };
    this.imdbEpisodeGql.mutate(variables)
      .subscribe(result => {
        this.importing = false;
        this.submitted = false;
        this.tvShowChapters = result.data.importImdbEpisodes;
      });
  }
}
