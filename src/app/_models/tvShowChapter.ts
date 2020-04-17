import {Tape} from './tape';
import {TvShow} from './tvShow';

export interface TvShowChapter {
  tape: Tape;
  tvShow: TvShow;
  chapter: number;
  createdAt: Date;
  season: number;
}
