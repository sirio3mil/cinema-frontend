import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Tape} from '../_models';
import {ImportImdbMovieGQL} from '../_gql';

@Component({templateUrl: 'import-imdb-movie.component.html'})
export class ImportImdbMovieComponent implements OnInit {

  importing = false;
  submitted = false;

  tape: Tape;
  importForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private importImdbMovieService: ImportImdbMovieGQL
  ) {
  }

  ngOnInit() {
    this.importForm = this.formBuilder.group({
      imdbNumber: ['', Validators.required]
    });
  }

  get f() {
    return this.importForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.importForm.invalid) {
      return;
    }
    this.importing = true;
    const variables = {
      imdbNumber: +this.f.imdbNumber.value
    };
    this.importImdbMovieService.mutate(variables)
      .subscribe(result => {
        this.importing = false;
        this.submitted = false;
        this.tape = result.data.importImdbMovie;
      });
  }
}
