import {Component, Input} from '@angular/core';
import {Tape, User} from '../_models';
import {faLink, faInfo, faTrash, faKissBeam, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {DeleteTapeUserHistoryGql} from '../_gql';
import {AlertService, AuthenticationService} from '../_services';
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
  downloaded = 1;

  constructor(
    private ngbModal: NgbModal,
    private deleteTapeUserHistoryGql: DeleteTapeUserHistoryGql,
    private alertService: AlertService,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  deleteFromWishList(tape: Tape) {
    const {tapeUserHistoryId, wishListIndex} = this.getWishListIds(tape);
    this.deleteTapeUserHistory(tapeUserHistoryId, this.currentUser.wishList, wishListIndex);
  }

  private getWishListIds(tape: Tape) {
    let tapeUserHistoryId = 0;
    let wishListIndex = 0;
    for (const [index, value] of this.currentUser.wishList.entries()) {
      if (value.tape.tapeId === tape.tapeId) {
        tapeUserHistoryId = value.tapeUserHistory.tapeUserHistoryId;
        wishListIndex = index;
        return {tapeUserHistoryId, wishListIndex};
      }
    }
    return {tapeUserHistoryId, wishListIndex};
  }

  deleteFromDownloaded(tape: Tape, list: Tape[] | null) {
    if (list) {
      this.deleteFromList(tape, list, this.downloaded);
    } else {
      const tapeUserHistoryId = this.getTapeUserHistoryId(tape, this.downloaded);
      this.deleteTapeUserHistory(tapeUserHistoryId, null, null);
    }
  }

  deleteFromList(tape: Tape, list: Tape[], status: number) {
    const {tapeUserHistoryId, listIndex} = this.search(list, tape, status);
    this.deleteTapeUserHistory(tapeUserHistoryId, list, listIndex);
  }

  private deleteTapeUserHistory(tapeUserHistoryId: number, list: any[] | null, listIndex: number | null) {
    this.alertService.clear();
    if (tapeUserHistoryId > 0) {
      const variables = {
        tapeUserHistoryId
      };
      this.deleteTapeUserHistoryGql.mutate(variables)
        .subscribe(() => {
          if (listIndex) {
            list.splice(listIndex, 1);
          }
          this.alertService.success('Deleted successfully');
        });
    }
  }

  private search(list: Tape[], target: Tape, status: number) {
    let tapeUserHistoryId = 0;
    let listIndex = 0;
    for (const [index, tape] of list.entries()) {
      if (target.tapeId === tape.tapeId) {
        tapeUserHistoryId = this.getTapeUserHistoryId(tape, status);
        listIndex = index;
        return {tapeUserHistoryId, listIndex};
      }
    }
    return {tapeUserHistoryId, listIndex};
  }

  protected getTapeUserHistoryId(tape: Tape, status: number) {
    if (tape.tapeUser && tape.tapeUser.history) {
      for (const history of tape.tapeUser.history) {
        const tapeUserStatusId = +history.tapeUserStatus.tapeUserStatusId;
        if (tapeUserStatusId === status) {
          return history.tapeUserHistoryId;
        }
      }
    }
    return null;
  }

  addTapeUser(tape: Tape) {
    const modalRef = this.ngbModal.open(EditTapeUserComponent);
    modalRef.componentInstance.title = tape.originalTitle;
    modalRef.componentInstance.tapeId = tape.tapeId;
    modalRef.result
      .then(result => {
        tape.tapeUser = result;
        if (this.getTapeUserHistoryId(tape, this.view)) {
          this.deleteFromWishList(tape);
        }
      });
  }

  isWishListPage(route: string): boolean {
    return route === 'home';
  }

  isDownloadedPage(route: string): boolean {
    return route === 'download';
  }

  printTitle(tape: Tape) {
    return tape.default.title && tape.originalTitle !== tape.default.title.searchParam;
  }

  printDirector(tape: Tape) {
    return tape.default.director && (!tape.default.cast || tape.default.cast.fullName !== tape.default.director.fullName);
  }
}
