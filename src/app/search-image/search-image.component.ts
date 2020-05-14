import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService, GoogleImageSearchService, SearchResult} from '../_services';
import {User} from '../_models';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {NgbCarousel} from '@ng-bootstrap/ng-bootstrap';
import {faFileImport} from '@fortawesome/free-solid-svg-icons';

@Component({templateUrl: 'search-image.component.html'})
export class SearchImageComponent implements OnInit {
  public currentUser: User;
  searchResult: SearchResult;
  pauseOnHover = true;
  faFileImport = faFileImport;
  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  constructor(
    private route: ActivatedRoute,
    private imageSearchService: GoogleImageSearchService,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          return this.imageSearchService.getAll(params.get('title'));
        })
      )
      .subscribe((data: SearchResult) => {
        this.searchResult = data;
        console.log('What is my result', this.searchResult);
      });
  }

  importImage() {
    const regex = /\D+/gm;
    const activeId = +this.carousel.activeId.replace(regex, '');
    const resultItem = this.searchResult.items[activeId];
    console.log(resultItem);
  }
}
