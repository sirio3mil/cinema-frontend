import {Component, OnInit} from '@angular/core';
import {AlertService} from '../_services';
import {map, switchMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {TapeGql} from '../_gql';
import {Tape, TvShowChapterSummary} from '../_models';
import {angularMath} from 'angular-ts-math';
import {faFileImport} from '@fortawesome/free-solid-svg-icons';
import {EditSeasonUserComponent} from '../edit-season-user';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

class SeasonDetail {
  number: number;
  code: string;
  viewed: boolean;
}

@Component({templateUrl: 'tape.component.html'})
export class TapeComponent implements OnInit {
  tape: Tape;
  tapeSubscription: Subscription;
  seasons: SeasonDetail[];
  summary: TvShowChapterSummary;

  faFileImport = faFileImport;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private tapeGql: TapeGql,
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
        if (tape.tvShow && tape.tvShow.summaryByUser) {
          this.summary = tape.tvShow.summaryByUser;
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
              detail.code = season.padStart(2 , '0');
              detail.viewed = detail.number <= viewedSeason;
              return detail;
            });
          }
        }
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
}
