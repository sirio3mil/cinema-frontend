import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../_services';
import {map, switchMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {TapeUser, TapeUserHistory, TvShowChapter, User} from '../_models';
import {ListTvShowChapterGql} from '../_gql';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {EditSeasonUserComponent} from '../edit-season-user';
import {EditTapeUserComponent} from '../edit-tape-user';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {faPlusCircle, faCheckCircle, faUndo} from '@fortawesome/free-solid-svg-icons';

@Component({templateUrl: 'list-tv-show-chapter.component.html'})
export class ListTvShowChapterComponent implements OnInit {
  public currentUser: User;
  public subscription: Subscription;
  tvShowChapters: TvShowChapter[];
  tvShowId: number;
  season: number;

  faPlusCircle = faPlusCircle;
  faCheckCircle = faCheckCircle;
  faUndo = faUndo;

  constructor(
    private listTvShowChapterGql: ListTvShowChapterGql,
    private authenticationService: AuthenticationService,
    private ngbModal: NgbModal,
    private route: ActivatedRoute
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.subscription = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.tvShowId = +params.get('tvShowId');
          this.season = +params.get('season');
          const variables = {
            userId: this.currentUser.userId,
            tvShowId: this.tvShowId,
            season: this.season
          };
          return this.listTvShowChapterGql.watch(variables)
            .valueChanges
            .pipe(map(result => result.data.listTvShowChapter));
        })
      ).subscribe((tvShowChapters: TvShowChapter[]) => {
        this.tvShowChapters = tvShowChapters;
      });
  }

  addSeasonUser() {
    const modalRef = this.ngbModal.open(EditSeasonUserComponent);
    modalRef.componentInstance.title = '';
    modalRef.componentInstance.tvShowId = this.tvShowId;
    modalRef.componentInstance.seasonNumber = this.season;
    modalRef.result
      .then((result: TapeUser[]) => {
        result.forEach((tapeUser: TapeUser) => {
          this.tvShowChapters.forEach((chapter: TvShowChapter) => {
            if (tapeUser.tape.tapeId === chapter.tape.tapeId) {
              chapter.tape.tapeUser = tapeUser;
            }
          });
        });
      });
  }

  addTapeUser(chapter: TvShowChapter) {
    const modalRef = this.ngbModal.open(EditTapeUserComponent);
    modalRef.componentInstance.title = chapter.tape.originalTitle;
    modalRef.componentInstance.tapeId = chapter.tape.tapeId;
    modalRef.result
      .then((result: TapeUser) => {
        chapter.tape.tapeUser = result;
      });
  }

  isPending(chapter: TvShowChapter) {
    let pending = true;
    if (!chapter.tape.tapeUser || !chapter.tape.tapeUser.history) {
      return pending;
    }
    chapter.tape.tapeUser.history.forEach((data: TapeUserHistory) => {
      const tapeUserStatusId = +data.tapeUserStatus.tapeUserStatusId;
      if (tapeUserStatusId === 2) {
        pending = false;
      }
    });
    return pending;
  }
}
