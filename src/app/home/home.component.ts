import {Component, OnInit} from '@angular/core';
import {User} from '../_models';
import {AuthenticationService} from '../_services';
import {faTrash, faLink} from '@fortawesome/free-solid-svg-icons';
import {DeleteTapeUserHistoryGql} from '../_gql';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
  currentUser: User;

  faTrash = faTrash;
  faLink = faLink;

  constructor(
    private authenticationService: AuthenticationService,
    private deleteTapeUserHistoryGql: DeleteTapeUserHistoryGql
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
  }

  deleteFromWishList(tapeUserHistoryId: number, index: number) {
    const variables = {
      tapeUserHistoryId
    };
    this.deleteTapeUserHistoryGql.mutate(variables)
      .subscribe(() => {
        this.currentUser.wishList.splice(index, 1);
      });
  }
}
