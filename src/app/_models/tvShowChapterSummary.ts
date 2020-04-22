import {TvShowChapter} from './tvShowChapter';
import {TvShow} from './tvShow';
import {User} from './user';

export interface TvShowChapterSummary {
  importedChapter: TvShowChapter;
  tvShow: TvShow;
  user: User;
  viewedChapter: TvShowChapter;
}
