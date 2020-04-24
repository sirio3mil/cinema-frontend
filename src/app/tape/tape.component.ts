import {Component, OnInit} from '@angular/core';
import {AlertService} from '../_services';
import {map, switchMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {EditTapeUserHistoryDetailGql, EditTvShowGql, TapeGql} from '../_gql';
import {Tape, TvShowChapterSummary} from '../_models';
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
import {EditSeasonUserComponent} from '../edit-season-user';
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

  public imdbUrl: string;
  public tape: Tape;
  public tapeSubscription: Subscription;
  public seasons: SeasonDetail[];
  public summary: TvShowChapterSummary;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private tapeGql: TapeGql,
    private editTvShowGql: EditTvShowGql,
    private editTapeUserHistoryDetailGql: EditTapeUserHistoryDetailGql,
    private ngbModal: NgbModal
  ) {
  }

  ngOnInit() {
    this.tapeSubscription = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          return this.tapeGql.watch(
            {
              tapeId: params.get('tapeId'),
              userId: 1
            })
            .valueChanges
            .pipe(map(result => result.data.tape));
        })
      ).subscribe((tape: Tape) => {
        this.tape = tape;
        this.imdbUrl = ('' + tape.object.imdbNumber.imdbNumber).padStart(7, '0');
        this.setTapeUserStatus();
        this.setSeasonDetails();
      });
  }

  addSeasonUser(season: SeasonDetail) {
    const modalRef = this.ngbModal.open(EditSeasonUserComponent);
    modalRef.componentInstance.title = this.tape.originalTitle;
    modalRef.componentInstance.tvShowId = this.tape.tapeId;
    modalRef.componentInstance.seasonNumber = season.number;
    modalRef.componentInstance.userId = 1;
    modalRef.result
      .then(() => {
        season.viewed = true;
      });
  }

  addTapeUser() {
    const modalRef = this.ngbModal.open(EditTapeUserComponent);
    modalRef.componentInstance.title = this.tape.originalTitle;
    modalRef.componentInstance.tapeId = this.tape.tapeId;
    modalRef.componentInstance.userId = 1;
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
