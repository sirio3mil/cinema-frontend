import {Component, Input} from '@angular/core';
import {Tape, User, WishList} from '../_models';
import {faLink, faInfo, faTrash, faKissBeam} from '@fortawesome/free-solid-svg-icons';
import {DeleteTapeUserHistoryGql} from '../_gql';
import {AuthenticationService} from '../_services';

@Component({
  selector: 'app-tape-list-card',
  templateUrl: 'tape-list-card.component.html'
})
export class TapeListCardComponent {
  @Input() tape: Tape;
  faLink = faLink;
  faInfo = faInfo;
  faTrash = faTrash;
  faKissBeam = faKissBeam;
  private currentUser: User;
  constructor(
    private deleteTapeUserHistoryGql: DeleteTapeUserHistoryGql,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  deleteFromWishList(tapeId: number) {
    let tapeUserHistoryId = 0;
    let wishListIndex: number;
    this.currentUser.wishList.forEach((value: WishList, index: number) => {
      if (value.tape.tapeId === tapeId) {
        tapeUserHistoryId = value.tapeUserHistory.tapeUserHistoryId;
        wishListIndex = index;
      }
    });
    if (tapeUserHistoryId > 0) {
      const variables = {
        tapeUserHistoryId
      };
      this.deleteTapeUserHistoryGql.mutate(variables)
        .subscribe(() => {
          this.currentUser.wishList.splice(wishListIndex, 1);
        });
    }
  }
}
