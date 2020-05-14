import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

const searchEngineKey = environment.searchEngineKey;
const googleApiKey = environment.googleApiKey;
const googleSearchEndpoint = environment.googleSearchEndpoint;

export interface ResultImage {
  src: string;
  width: number;
  height: number;
}

export interface Pagemap {
  cse_image: ResultImage[];
  cse_thumbnail: ResultImage[];
}

export interface ResultItem {
  title: string;
  link: string;
  snippet: string;
  pagemap: Pagemap;
}

export interface SearchResult {
  items: ResultItem[];
}

@Injectable({providedIn: 'root'})
export class GoogleImageSearchService {
  constructor(private http: HttpClient) {
  }

  getAll(param: string) {
    return this.http.get<SearchResult>(`${googleSearchEndpoint}?key=${googleApiKey}&cx=${searchEngineKey}&q=${param}&imgSize=large`);
  }
}
