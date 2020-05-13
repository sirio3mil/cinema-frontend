import {Component, forwardRef, Input, OnDestroy, OnInit} from '@angular/core';
import {TapeUserStatus} from '../_models';
import {ListTapeUserStatusGQL} from '../_gql';
import {ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';
import {BehaviorSubject, Subscription} from 'rxjs';

export interface TapeUserStatusFormValues {
  tapeUserStatus: TapeUserStatus;
}

@Component({
  selector: 'app-tape-user-status',
  templateUrl: 'tape-user-status.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TapeUserStatusComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TapeUserStatusComponent),
      multi: true
    }
  ]
})
export class TapeUserStatusComponent implements OnInit, ControlValueAccessor, OnDestroy {
  listTapeUserStatus: TapeUserStatus[];
  statusForm: FormGroup;
  subscriptions: Subscription[] = [];
  currentListSubject: BehaviorSubject<TapeUserStatus[]>;

  @Input() submitted: boolean;

  constructor(
    private listTapeUserStatusService: ListTapeUserStatusGQL,
    private formBuilder: FormBuilder
  ) {
    this.statusForm = this.formBuilder.group({
      tapeUserStatus: ['', Validators.required]
    });
    this.subscriptions.push(
      this.statusForm.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
    this.currentListSubject = new BehaviorSubject<TapeUserStatus[]>(JSON.parse(localStorage.getItem('listTapeUserStatus')));
    this.listTapeUserStatus = this.currentListSubject.getValue();
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
      this.statusForm.reset();
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
    if (!this.listTapeUserStatus) {
      this.load();
    }
  }

  private load() {
    const variables = {
      page: 1,
      pageSize: 20
    };
    this.subscriptions.push(this.listTapeUserStatusService.watch(variables)
      .valueChanges
      .pipe(map(result => result.data.listTapeUserStatus.elements))
      .subscribe(
        (listTapeUserStatus: TapeUserStatus[]) => {
          this.listTapeUserStatus = listTapeUserStatus;
          localStorage.setItem('listTapeUserStatus', JSON.stringify(listTapeUserStatus));
        }));
  }

  get f() {
    return this.statusForm.controls;
  }

  get value(): TapeUserStatusFormValues {
    return this.statusForm.value;
  }

  set value(value: TapeUserStatusFormValues) {
    this.statusForm.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  validate(_: FormControl) {
    return this.statusForm.valid ? null : {tapeUserStatus: {valid: false}};
  }
}
