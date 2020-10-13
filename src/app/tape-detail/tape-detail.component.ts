import { Component, Input, OnInit } from '@angular/core';
import {
  faCheckCircle,
  faClipboardList,
  faCloudSun,
  faFileImport,
  faHourglassEnd,
  faImages,
  faLink,
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { angularMath } from 'angular-ts-math';
import { EditTapeUserHistoryDetailGql, EditTvShowGql } from '../_gql';
import { Tape, TvShowChapterSummary, User } from '../_models';
import { AlertService, AuthenticationService } from '../_services';
import { EditTapeUserComponent } from '../edit-tape-user';

class SeasonDetail {
  number: number;
  code: string;
  viewed: boolean;
}

@Component({
  selector: 'app-tape-detail',
  templateUrl: 'tape-detail.component.html',
  styles: [`
             .star {
               position : relative;
               display  : inline-block;
               color    : #d3d3d3;
             }

             .full {
               color : #1e90ff;
             }

             .half {
               position : absolute;
               display  : inline-block;
               overflow : hidden;
               color    : #1e90ff;
             }
           `]
})
export class TapeDetailComponent implements OnInit {
  @Input() tape: Tape;
  public seasons: SeasonDetail[];
  public summary: TvShowChapterSummary;
  public currentUser: User;

  faFileImport = faFileImport;
  faPlusCircle = faPlusCircle;
  faCheckCircle = faCheckCircle;
  faClipboardList = faClipboardList;
  faHourglassEnd = faHourglassEnd;
  faLink = faLink;
  faCloudSun = faCloudSun;
  faImages = faImages;

  view = 2;
  whichList = 3;
  viewed = false;
  whichListed = false;
  currentRate = 0;

  constructor(
    private alertService: AlertService,
    private editTvShowGql: EditTvShowGql,
    private editTapeUserHistoryDetailGql: EditTapeUserHistoryDetailGql,
    private ngbModal: NgbModal,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.setTapeUserStatus();
    this.setSeasonDetails();
    this.setRating();
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

  protected setRating() {
    if (this.tape.object.ranking && this.tape.object.ranking.calculatedScore) {
      this.currentRate = Math.round(this.tape.object.ranking.calculatedScore * 100) / 100;
    }
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
      if (tapeUserStatusId === this.view) {
        for (let detail of history.details) {
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

  pad(data: number): string {
    return data.toString(10).padStart(2, '0');
  }
}
