import {Component, Input, OnInit} from '@angular/core';
import {TapeUserStatus} from '../_models';
import {ListTapeUserStatusGQL} from '../_gql';
import {FormGroup} from '@angular/forms';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-tape-user-status',
  templateUrl: 'tape-user-status.component.html'
})
export class TapeUserStatusComponent implements OnInit {
  @Input() editForm: FormGroup;
  @Input() submitted: boolean;
  listTapeUserStatus: TapeUserStatus[];

  constructor(
    private listTapeUserStatusService: ListTapeUserStatusGQL
  ) {
  }

  ngOnInit() {
    const variables = {
      page: 1,
      pageSize: 20
    };
    this.listTapeUserStatusService.watch(variables)
      .valueChanges
      .pipe(map(result => result.data.listTapeUserStatus.elements))
      .subscribe(
        (listTapeUserStatus: TapeUserStatus[]) => {
          this.listTapeUserStatus = listTapeUserStatus;
        });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.editForm.controls;
  }
}
