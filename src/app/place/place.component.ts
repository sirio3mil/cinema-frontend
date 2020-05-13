import {Component, forwardRef, Input, OnDestroy, OnInit} from '@angular/core';
import {Place} from '../_models';
import {ListPlaceGQL} from '../_gql';
import {ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';
import {BehaviorSubject, Subscription} from 'rxjs';

export interface PlaceFormValues {
  place: Place;
}

@Component({
  selector: 'app-place',
  templateUrl: 'place.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PlaceComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PlaceComponent),
      multi: true
    }
  ]
})
export class PlaceComponent implements OnInit, ControlValueAccessor, OnDestroy {
  placeForm: FormGroup;
  places: Place[];
  subscriptions: Subscription[] = [];
  currentListSubject: BehaviorSubject<Place[]>;

  @Input() submitted: boolean;

  constructor(
    private listPlaceGQL: ListPlaceGQL,
    private formBuilder: FormBuilder
  ) {
    this.placeForm = this.formBuilder.group({
      place: ['', Validators.required]
    });
    this.subscriptions.push(
      this.placeForm.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
    this.currentListSubject = new BehaviorSubject<Place[]>(JSON.parse(localStorage.getItem('places')));
    this.places = this.currentListSubject.getValue();
  }

  onChange: any = () => {
  }
  onTouched: any = () => {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  writeValue(obj: any): void {
    if (obj) {
      this.value = obj;
    }

    if (obj === null) {
      this.placeForm.reset();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    if (!this.places) {
      this.load();
    }
  }

  private load() {
    const variables = {
      page: 1,
      pageSize: 20
    };
    this.subscriptions.push(this.listPlaceGQL.watch(variables)
      .valueChanges
      .pipe(map(result => result.data.listPlace.elements))
      .subscribe(
        (places: Place[]) => {
          this.places = places;
          localStorage.setItem('places', JSON.stringify(places));
        }));
  }

  get f() {
    return this.placeForm.controls;
  }

  get value(): PlaceFormValues {
    return this.placeForm.value;
  }

  set value(value: PlaceFormValues) {
    this.placeForm.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  validate(_: FormControl) {
    return this.placeForm.valid ? null : {place: {valid: false}};
  }
}
