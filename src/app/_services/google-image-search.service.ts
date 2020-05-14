import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

const searchEngineKey = environment.searchEngineKey;
const googleApiKey = environment.googleApiKey;
const googleSearchEndpoint = environment.googleSearchEndpoint;

@Injectable({providedIn: 'root'})
export class GoogleImageSearchService {
  constructor(private http: HttpClient) {
  }

  getAll(param: string) {
    return this.http.get<object>(`${googleSearchEndpoint}?key=${googleApiKey}&cx=${searchEngineKey}&q=${param}&imgSize=large`);
  }
}
