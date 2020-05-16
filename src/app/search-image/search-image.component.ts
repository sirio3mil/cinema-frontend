import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertService, AuthenticationService, GoogleImageSearchService, SearchResult} from '../_services';
import {User} from '../_models';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {faFileImport} from '@fortawesome/free-solid-svg-icons';
import {ImportFileGql} from '../_gql';
import {Location} from '@angular/common';
import {NgbCarousel} from '@ng-bootstrap/ng-bootstrap';

@Component({templateUrl: 'search-image.component.html'})
export class SearchImageComponent implements OnInit {
  public currentUser: User;
  searchResult: SearchResult;
  pauseOnHover = true;
  faFileImport = faFileImport;
  objectId: string;
  @ViewChild('carousel', {static: true}) carousel: NgbCarousel;

  constructor(
    private route: ActivatedRoute,
    private imageSearchService: GoogleImageSearchService,
    private authenticationService: AuthenticationService,
    private importFileGql: ImportFileGql,
    private location: Location,
    private alertService: AlertService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.alertService.clear();
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.objectId = params.get('objectId');
          return this.imageSearchService.getAll(params.get('title'));
        })
      )
      .subscribe((data: SearchResult) => {
        this.searchResult = data;
      });
  }

  importImage(url: string) {
    this.carousel.pause();
    this.alertService.success(url);
    window.scroll(0, 0);
    const variables = {
      globalUniqueObjectId: this.objectId,
      url
    };
    this.importFileGql.mutate(variables)
      .subscribe(result => {
        this.currentUser.wishList.forEach(data => {
          if (data.tape.object.objectId === this.objectId) {
            data.tape.object = result.data.importFile;
          }
        });
        this.location.back();
      });
  }
}
