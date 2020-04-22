import {Tape} from './tape';
import {TvShowChapter} from './tvShowChapter';
import {TvShowChapterSummary} from './tvShowChapterSummary';

export interface TvShow {
  tape: Tape;
  chapters: TvShowChapter[];
  chaptersBySeason: TvShowChapter[];
  createdAt: Date;
  finished: boolean;
  lastChapter: TvShowChapter;
  summaries: TvShowChapterSummary[];
  summaryByUser: TvShowChapterSummary;
}
