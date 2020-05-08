import {Component, OnInit} from '@angular/core';
import {AlertService, AuthenticationService} from '../_services';
import {map, switchMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {EditTapeUserHistoryDetailGql, EditTvShowGql, TapeGql} from '../_gql';
import {Tape, TvShowChapterSummary, User} from '../_models';
import {angularMath} from 'angular-ts-math';
import {
  faCheckCircle,
  faFileImport,
  faPlusCircle,
  faClipboardList,
  faHourglassEnd,
  faLink,
  faCloudSun
} from '@fortawesome/free-solid-svg-icons';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditTapeUserComponent} from '../edit-tape-user';

class SeasonDetail {
  number: number;
  code: string;
  viewed: boolean;
}

@Component({templateUrl: 'tape.component.html'})
export class TapeComponent implements OnInit {

  faFileImport = faFileImport;
  faPlusCircle = faPlusCircle;
  faCheckCircle = faCheckCircle;
  faClipboardList = faClipboardList;
  faHourglassEnd = faHourglassEnd;
  faLink = faLink;
  faCloudSun = faCloudSun;

  view = 2;
  whichList = 3;
  viewed = false;
  whichListed = false;

  public tape: Tape;
  public tapeSubscription: Subscription;
  public seasons: SeasonDetail[];
  public summary: TvShowChapterSummary;
  public currentUser: User;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private tapeGql: TapeGql,
    private editTvShowGql: EditTvShowGql,
    private editTapeUserHistoryDetailGql: EditTapeUserHistoryDetailGql,
    private ngbModal: NgbModal,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.tapeSubscription = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          return this.tapeGql.watch(
            {
              tapeId: params.get('tapeId'),
              userId: this.currentUser.userId
            })
            .valueChanges
            .pipe(map(result => result.data.tape));
        })
      ).subscribe((tape: Tape) => {
        this.tape = tape;
        this.setTapeUserStatus();
        this.setSeasonDetails();
      });
  }

  addTapeUser() {
    const modalRef = this.ngbModal.open(EditTapeUserComponent);
    modalRef.componentInstance.title = this.tape.originalTitle;
    modalRef.componentInstance.tapeId = this.tape.tapeId;
    modalRef.result
      .then(result => {
        this.tape.tapeUser = result;
        this.setTapeUserStatus();
      });
  }

  protected setTapeUserStatus() {
    if (this.tape.tapeUser && this.tape.tapeUser.history) {
      for (const history of this.tape.tapeUser.history) {
        const tapeUserStatusId = +history.tapeUserStatus.tapeUserStatusId;
        switch (tapeUserStatusId) {
          case this.view:
            this.viewed = true;
            break;
          case this.whichList:
            this.whichListed = true;
            break;
        }
      }
    }
  }

  protected setSeasonDetails() {
    if (this.tape.tvShow && this.tape.tvShow.summaryByUser) {
      this.summary = this.tape.tvShow.summaryByUser;
      const importedChapter = this.summary.importedChapter;
      const viewedChapter = this.summary.viewedChapter;
      const viewedSeason = viewedChapter ? viewedChapter.season : 0;
      const importedSeason = importedChapter ? importedChapter.season : 0;
      const maxSeason = angularMath.getMaximum(importedSeason, viewedSeason);
      if (maxSeason > 0) {
        // @ts-ignore
        this.seasons = Array(maxSeason).fill().map((x, i) => {
          const detail = new SeasonDetail();
          detail.number = i + 1;
          const season = angularMath.numberToString(detail.number);
          detail.code = season.padStart(2, '0');
          detail.viewed = detail.number <= viewedSeason;
          return detail;
        });
      }
    }
  }

  toggleFinishedStatus() {
    const variables = {
      tapeId: this.tape.tapeId,
      finished: !this.tape.tvShow.finished
    };
    this.editTvShowGql.mutate(variables)
      .subscribe(result => {
        this.tape.tvShow.finished = result.data.editTvShow.finished;
      });
  }

  toggleVisibility() {
    for (const history of this.tape.tapeUser.history) {
      const tapeUserStatusId = +history.tapeUserStatus.tapeUserStatusId;
      if (tapeUserStatusId === this.view){
        for (let detail of history.details){
          const variables = {
            tapeUserHistoryDetailId: detail.tapeUserHistoryDetailId,
            visible: !detail.visible
          };
          this.editTapeUserHistoryDetailGql.mutate(variables)
            .subscribe(result => {
              detail = result.data.editTapeUserHistoryDetail;
            });
        }
      }
    }
  }
}
