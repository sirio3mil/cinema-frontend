import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from './_services';
import {User} from './_models';
import {faHome, faSearch, faSignOutAlt, faFileImport, faCopyright} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'cinema-frontend';
  faHome = faHome;
  faSearch = faSearch;
  faSignOutAlt = faSignOutAlt;
  faFileImport = faFileImport;
  faCopyright = faCopyright;

  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
