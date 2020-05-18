import {Component, Input} from '@angular/core';
import {Tape, User, WishList} from '../_models';
import {faLink, faInfo, faTrash, faKissBeam, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {DeleteTapeUserHistoryGql} from '../_gql';
import {AuthenticationService} from '../_services';
import {EditTapeUserComponent} from '../edit-tape-user';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tape-list-card',
  templateUrl: 'tape-list-card.component.html'
})
export class TapeListCardComponent {
  @Input() tape: Tape;
  @Input() route = '';
  faLink = faLink;
  faInfo = faInfo;
  faTrash = faTrash;
  faPlusCircle = faPlusCircle;
  faKissBeam = faKissBeam;
  private currentUser: User;
  view = 2;

  constructor(
    private ngbModal: NgbModal,
    private deleteTapeUserHistoryGql: DeleteTapeUserHistoryGql,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  deleteFromWishList(tape: Tape) {
    let tapeUserHistoryId = 0;
    let wishListIndex: number;
    this.currentUser.wishList.forEach((value: WishList, index: number) => {
      if (value.tape.tapeId === tape.tapeId) {
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

  protected is(tape: Tape, status: number): boolean {
    if (tape.tapeUser && tape.tapeUser.history) {
      for (const history of tape.tapeUser.history) {
        const tapeUserStatusId = +history.tapeUserStatus.tapeUserStatusId;
        if (tapeUserStatusId === status) {
          return true;
        }
      }
    }
    return false;
  }

  addTapeUser(tape: Tape) {
    const modalRef = this.ngbModal.open(EditTapeUserComponent);
    modalRef.componentInstance.title = tape.originalTitle;
    modalRef.componentInstance.tapeId = tape.tapeId;
    modalRef.result
      .then(result => {
        tape.tapeUser = result;
        if (this.is(tape, this.view)) {
          this.deleteFromWishList(tape);
        }
      });
  }

  isWishListPage(route: string): boolean {
    return route === 'home';
  }

  printTitle(tape: Tape) {
    return tape.default.title && tape.originalTitle !== tape.default.title.searchParam;
  }

  printDirector(tape: Tape) {
    return tape.default.director && (!tape.default.cast || tape.default.cast.fullName !== tape.default.director.fullName);
  }
}
