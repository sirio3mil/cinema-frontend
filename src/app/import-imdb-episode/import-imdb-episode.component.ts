import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../_services';
import {TvShowChapter} from '../_models';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {map} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ImportImdbEpisodeGql} from '../_gql';

@Component({templateUrl: 'import-imdb-episode.component.html'})
export class ImportImdbEpisodeComponent implements OnInit {

  importing = false;
  submitted = false;

  importForm: FormGroup;
  imdbNumber: number;
  tvShowChapters: TvShowChapter[];
  subscription: Subscription;

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
    this.subscription = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('imdbNumber'))
    ).subscribe((imdbNumber: string) => {
      this.imdbNumber = parseInt(imdbNumber, 10);
    });
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
      imdbNumber: this.imdbNumber,
      seasonNumber: parseInt(this.f.seasonNumber.value, 10)
    };
    this.imdbEpisodeGql.mutate(variables)
      .subscribe(result => {
        this.importing = false;
        this.submitted = false;
        this.tvShowChapters = result.data.importImdbEpisodes;
      });
  }
}
