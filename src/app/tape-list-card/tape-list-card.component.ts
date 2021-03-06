import {Component, Input} from '@angular/core';
import { Tape, TapeUser, User } from '../_models';
import {faLink, faInfo, faTrash, faKissBeam, faPlusCircle, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import {DeleteTapeUserHistoryGql} from '../_gql';
import {AlertService, AuthenticationService} from '../_services';
import {EditTapeUserComponent} from '../edit-tape-user';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EMPTY} from 'rxjs';

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
  faExclamationTriangle = faExclamationTriangle;
  private readonly currentUser: User;
  private tapeUserStatusViewed = 2;
  private tapeUserStatusDownloaded = 1;

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
    this.deleteTapeUserHistory(tapeUserHistoryId).subscribe(() => {
      if (wishListIndex) {
        this.currentUser.wishList.splice(wishListIndex, 1);
      }
      this.alertService.success('Deleted successfully');
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    });
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
      this.deleteFromList(tape, list, this.tapeUserStatusDownloaded);
    } else {
      const tapeUserHistoryId = this.getTapeUserHistoryId(tape, this.tapeUserStatusDownloaded);
      this.deleteTapeUserHistory(tapeUserHistoryId).subscribe(() => {
        this.alertService.success('Deleted successfully');
      });
    }
  }

  deleteFromList(tape: Tape, list: Tape[], status: number) {
    const {tapeUserHistoryId, listIndex} = this.search(list, tape, status);
    this.deleteTapeUserHistory(tapeUserHistoryId).subscribe(() => {
      if (listIndex) {
        list.splice(listIndex, 1);
      }
      this.alertService.success('Deleted successfully');
    });
  }

  private deleteTapeUserHistory(tapeUserHistoryId: number) {
    this.alertService.clear();
    if (tapeUserHistoryId > 0) {
      const variables = {
        tapeUserHistoryId
      };
      return this.deleteTapeUserHistoryGql.mutate(variables);
    }
    return EMPTY;
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
      .then((result: TapeUser) => {
        tape.tapeUser = result;
        if (this.getTapeUserHistoryId(tape, this.tapeUserStatusViewed)) {
          this.deleteFromWishList(tape);
        }
      }, () => {});
  }

  haveMissingChapters(tape: Tape): boolean {
    const tvShow = tape?.tvShow;
    if (tvShow === undefined){
      return false;
    }
    const lastChapter = tvShow?.lastChapter;
    if (lastChapter === undefined){
      return false;
    }
    const viewedChapter = tvShow?.summaryByUser?.viewedChapter;
    if (viewedChapter === undefined){
      return true;
    }
    return +viewedChapter?.tape.tapeId !== +lastChapter?.tape.tapeId;
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
